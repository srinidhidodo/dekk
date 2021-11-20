import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UrlConstants } from "../constants/url.constants";
import { Card } from "../models/card";
import { HttpClientService } from "./http-client.service";
import * as _ from 'lodash';
import { MatDialog } from "@angular/material/dialog";
import { PopupConstants } from "../constants/popup.constants";
import { StudyMsgDialogComponent } from "../components/study-msg-dialog/study-msg-dialog.component";
import { CardUtils } from "../utils/card.utils";

@Injectable({
    providedIn: 'root',
})
export class StudyService {

    dekkCards: Card[];
    currentCardIndex: number = -1; // Invalid card case
    isDekkComplete: boolean = false;
    dekkParams: any;
    selectedTag: string = 'invalid';

    constructor(private httpClientService: HttpClientService, public dialog: MatDialog) {}

    loadNewDekk(tags?: string[], dekkId?: string, cardId?: string): Observable<any> { 
        this.dekkCards = [];
        this.isDekkComplete = false;
        this.currentCardIndex = -1;

        // TODO: tags to be removed, dekkId to be mandatory
        // TODO: remove following segment related to tags processing
        tags = tags?.map(tag => '"' + tag + '"');
        const processedTags = '[' + tags?.join(',') + ']';

        this.dekkParams = {
            q: processedTags,
            offset: 0
        };

        const dekkLoadObservable = this.httpClientService.get(UrlConstants.CARDS_FROM_TAG_URL, [
            {
                key: 'q',
                value: this.dekkParams['q']
            },
            {
                key: 'offset',
                value: _.toString(this.dekkParams.offset)
            }
        ]);

        this.handleCardsLoad(dekkLoadObservable);

        return dekkLoadObservable;
    }

    getNextCard(): Observable<any> {
        const nextCardObservable = new Observable((observer) => {
            // If we somehow reached the last card and dekk is not yet over, return loading and load next cards
            if (!this.isDekkComplete && this.currentCardIndex === this.dekkCards?.length - 1) {
                this.loadMoreCards()?.subscribe(() => {
                    if (this.currentCardIndex < this.dekkCards?.length - 1) {
                        ++ this.currentCardIndex;
                        observer.next(this.dekkCards[this.currentCardIndex]);
                    } else {
                        const dialogRef = this.dialog.open(StudyMsgDialogComponent, {
                            data: {
                                msg: PopupConstants.DEKK_COMPLETE_MSG
                            }
                        });
                        dialogRef.afterClosed().subscribe(result => {
                            console.log('The dialog was closed: ', result);
                        });
                        observer.next(this.dekkCards[this.currentCardIndex]); // return same card when dekk is over
                    }
                });
            }
            // If there are 5 cards left and the dekk is not yet over, load the next set preemptively
            else if (!this.isDekkComplete && this.currentCardIndex === this.dekkCards?.length - 5) {
                this.loadMoreCards();
                ++ this.currentCardIndex;
                observer.next(this.dekkCards[this.currentCardIndex]);
            } 
            // TODO? add a check here for currentCardIndex at the end but next card set not yet loaded
            else if (this.isDekkComplete && this.currentCardIndex === this.dekkCards.length - 1) {
                const dialogRef = this.dialog.open(StudyMsgDialogComponent, {
                    data: {
                        msg: PopupConstants.DEKK_COMPLETE_MSG
                    }
                });
            
                dialogRef.afterClosed().subscribe(result => {
                    console.log('The dialog was closed: ', result);
                });
                observer.next(this.dekkCards[this.currentCardIndex]); // return same card when dekk is over
            } else {
                this.currentCardIndex = this.currentCardIndex < 0 ? 0 : this.currentCardIndex + 1;
                observer.next(this.dekkCards[this.currentCardIndex]);
            }
        });
        return nextCardObservable;
    }

    getPreviousCard(): Card {
        if (this.currentCardIndex > 0) {
            --this.currentCardIndex;
            return this.dekkCards[this.currentCardIndex];
        } else {
            const dialogRef = this.dialog.open(StudyMsgDialogComponent, {
                data: {
                    msg: PopupConstants.DEKK_BEGINNING_MSG
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                console.log('The dialog was closed: ', result);
            });
            return this.dekkCards[this.currentCardIndex];
        }
    }

    loadMoreCards(): Observable<any> {
        this.dekkParams.offset = this.dekkCards.length;
        const nextLoadObservable = this.httpClientService.get(UrlConstants.CARDS_FROM_TAG_URL, [
            {
                key: 'q',
                value: this.dekkParams['q']
            },
            {
                key: 'offset',
                value: _.toString(this.dekkParams.offset)
            }
        ]);

        this.handleCardsLoad(nextLoadObservable);

        return nextLoadObservable;
    }

    private handleCardsLoad(cardLoadObservable: Observable<any>): void {
        cardLoadObservable.subscribe((response: any) => {
            if (!response) {
                const dialogRef = this.dialog.open(StudyMsgDialogComponent, {
                    data: {
                        msg: PopupConstants.CARD_LOAD_ERROR
                    }
                });
            
                dialogRef.afterClosed().subscribe(result => {
                    console.log('The dialog was closed: ', result);
                });
            } else if (response.total_cards_found < CardUtils.OFFSET_LOAD_MAX_NUM_OF_CARDS) { // this means the dekk is over at/after this point
                this.isDekkComplete = true;
                this.dekkCards = this.dekkCards.concat(response.results);
            } else {
                this.dekkCards = this.dekkCards.concat(response.results);
            }

            // increment card index if possible
            this.currentCardIndex = this.dekkCards.length > 0 
                && this.currentCardIndex < this.dekkCards.length - 1 ? this.currentCardIndex + 1 : this.currentCardIndex;
        }, (error: any) => {
            const dialogRef = this.dialog.open(StudyMsgDialogComponent, {
                data: {
                    msg: PopupConstants.CARD_LOAD_ERROR
                }
            });
        
            dialogRef.afterClosed().subscribe(result => {
                console.log('The dialog was closed: ', result);
            });
        });
    }

    getUnhighlightedCardFront(): string {
        if (this.currentCardIndex < 0) {
            return 'Invalid card';
        }
        return this.getUnhighlightedContent(this.dekkCards[this.currentCardIndex]?.content_on_front);
    }

    getUnhighlightedCardBack(): string {
        if (this.currentCardIndex < 0) {
            return 'Invalid card';
        }
        return this.getUnhighlightedContent(this.dekkCards[this.currentCardIndex]?.content_on_back);
    }

    private getUnhighlightedContent(content: string): string {
        let index = content.indexOf('*');
        while (index >= 0) {
            content = content.substring(0, index) + content.substring(index + 1);
            index = content.lastIndexOf('*');
        }
        return content;
    }

    getHighlightedCardFront(): string {
        return this.getHighlightedContent(this.dekkCards[this.currentCardIndex]?.content_on_front);
    }

    getHighlightedCardBack(): string {
        return this.getHighlightedContent(this.dekkCards[this.currentCardIndex]?.content_on_back);
    }

    private getHighlightedContent(content: string): string {
        let isEven = true;
        let index = content.lastIndexOf('*');
        while (index >= 0) {
            if (isEven) {
                content = content.substring(0, index) + '</mark>' + content.substring(index + 1);
            } else {
                content = content.substring(0, index) + '<mark>' + content.substring(index + 1);
            }
            isEven = !isEven;
            index = content.lastIndexOf('*');
        }
        return content;
    }

    getCurrentCard(): Card {
        if (this.dekkCards.length > 0 && this.currentCardIndex > -1) {
            return this.dekkCards[this.currentCardIndex];
        }
        return CardUtils.getDummyCard();
    }
}