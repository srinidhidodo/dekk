import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { toDoc } from 'ngx-editor';
import { Subscription } from 'rxjs';
import { ErrorDialogComponent } from 'src/app/common/components/error-dialog/error-dialog.component';
import { PopupConstants } from 'src/app/common/constants/popup.constants';
import { UrlConstants } from 'src/app/common/constants/url.constants';
import { Card } from 'src/app/common/models/card';
import { CardEditable } from 'src/app/common/models/card-editable';
import { Tag } from 'src/app/common/models/tag';
import { DekkService } from 'src/app/common/services/dekk-service';
import { TagsService } from 'src/app/common/services/tags.service';
import { CardUtils } from 'src/app/common/utils/card.utils';
import { TextEditComponent } from '../../text-edit/text-edit.component';

declare var tinymce: any;

@Component({
  selector: 'app-create-edit-card',
  templateUrl: './create-edit-card.component.html',
  styleUrls: ['./create-edit-card.component.scss']
})
export class CreateEditCardComponent implements OnInit {

  @ViewChild('cardFront')
  cardFrontEditComponent: TextEditComponent;

  @ViewChild('cardBack')
  cardBackEditComponent: TextEditComponent;

  routeListener: Subscription;

  tags: FormControl = new FormControl();
  tagsList: Tag[] = [];
  currentDekkId: string;
  currentCardId: string;
  currentCardTitle: string = '';
  currentCardFront: string = '';
  currentCardBack: string = '';
  currentCard: Card = CardUtils.getWaitCard();

  cardFrontEditorId = 'cardFrontEditorId';
  cardBackEditorId = 'cardBackEditorId';

  isLoading: boolean = true;

  constructor(public tagsService: TagsService, private dekkService: DekkService, private router: Router, private activatedRoute: ActivatedRoute, private dialog: MatDialog) {
    this.tags = new FormControl();
    this.tagsService.loadTags().subscribe(()=>{});
    this.routeListener = this.router.events.subscribe((event) => {
      this.isLoading = true;
      if (event instanceof NavigationEnd) {
        const currentUrl = event.url.split('?')[0];
        if (currentUrl === UrlConstants.CARD_EDIT_VIEW) {
          this.activatedRoute.queryParams.subscribe((params: any) => {
            if (params.dekk_id) {
              this.currentDekkId = params.dekk_id;
              if (params.id) {
                this.currentCardId = params.id;
                this.dekkService.loadCardByCardId(this.currentCardId!).subscribe((card: Card[]) => {
                  this.currentCard = card[0];
                  this.currentCardTitle = this.currentCard.title;
                  this.currentCardFront = this.processEditorText(this.currentCard.content_on_front);
                  this.currentCardBack = this.processEditorText(this.currentCard.content_on_back);
                  setTimeout(() => {
                    this.isLoading = false;
                  }, 1000);
                }, (error: any) => {
                  this.handleCardLoadError();
                });
              } else {
                this.currentCardId = '';
                setTimeout(() => {
                  this.isLoading = false;
                }, 1000);
              }
            } else {
              this.handleCardLoadError();
            }
          });
        }
      }
    });
  }

  processEditorText(inputText: string): string {
    let processedText = inputText.replace('\n', '<br />');
    let isEven = true;
    let index = processedText.lastIndexOf('*');
    while (index >= 0) {
        if (isEven) {
          processedText = processedText.substring(0, index) + CardUtils.HIGHLIGHTER_CLOSE_TAG + processedText.substring(index + 1);
        } else {
          processedText = processedText.substring(0, index) + CardUtils.HIGHLIGHTER_OPEN_TAG + processedText.substring(index + 1);
        }
        isEven = !isEven;
        index = processedText.lastIndexOf('*');
    }
    return processedText;
  }
  
  ngOnInit(): void {
    this.tags.setValue(this.currentCard.tags);
  }

  ngOnDestroy(): void {
    this.routeListener.unsubscribe();
    tinymce.remove();
  }

  handleCardLoadError(): void {
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      data: {
          msg: PopupConstants.CARD_METADATA_LOAD_ERROR
      }
    });
    dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed: ', result);
    });
  }

  handleCardSaveError(): void {
    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      data: {
          msg: PopupConstants.CARD_METADATA_SAVE_ERROR
      }
    });
    dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed: ', result);
    });
  }

  createDekk(): void {
  }

  saveCard(): void {
    this.isLoading = true;
    this.dekkService.saveCard({
      title: this.currentCardTitle,
      content_on_front: this.cardFrontEditComponent.convertCardContentToPayload(),
      content_on_back: this.cardBackEditComponent.convertCardContentToPayload(),
      dekk_id: this.currentDekkId,
      new_tags: [],
      selected_tag_ids: this.tags.value.map((tag: Tag) => tag.tag_id)
    }, this.currentCardId).subscribe((response: any) => {
      this.router.navigate([UrlConstants.DEKK_EDIT_VIEW], {queryParams: { id: this.currentDekkId }});
    }, (error: any) => {
      this.handleCardSaveError();
    });
  }
}
