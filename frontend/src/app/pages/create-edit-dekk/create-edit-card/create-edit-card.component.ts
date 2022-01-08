import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { toDoc } from 'ngx-editor';
import { Subscription } from 'rxjs';
import { ErrorDialogComponent } from 'src/app/common/components/error-dialog/error-dialog.component';
import { MsgDialogComponent } from 'src/app/common/components/msg-dialog/msg-dialog.component';
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

  allTagOptions: Tag[];
  tagOptions: Tag[];
  tags: FormControl = new FormControl();
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
    this.tagsService.loadTags().subscribe(()=>{
      this.allTagOptions = tagsService.tagsList;
      this.tagOptions = this.allTagOptions;
    });
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
                  this.tags.setValue(this.tagsService.tagsList.filter((tag: Tag) => this.currentCard.tags?.includes(tag.tag_id!)));
                  // this.tagsList.setValue(this.tags.value.map((tag: Tag) => tag.tag_name));
                  setTimeout(() => {
                    this.isLoading = false;
                  }, 500);
                }, (error: any) => {
                  this.handleCardLoadError();
                });
              } else {
                this.currentCardId = '';
                setTimeout(() => {
                  this.isLoading = false;
                }, 500);
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
    // this.tags.setValue(this.currentCard.tags);
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
    console.log(this.tags.value);
    if (this.currentCardTitle?.length === 0) {
      this.cardSaveMsgPopup(PopupConstants.CARD_TITLE_ERROR);
      return;
    }

    if (!this.cardFrontEditComponent.convertCardContentToPayload()
      || !this.cardBackEditComponent.convertCardContentToPayload()) {
      this.cardSaveMsgPopup(PopupConstants.CARD_CONTENT_ERROR);
      return;
    }

    this.isLoading = true;
    const new_tags = this.tags && Object.keys(this.tags.value).length > 0 ? this.tags.value.filter((tag: any) => !tag.tag_id).map((tag: any) => tag.tag_name) : [];
    const selected_tag_ids = this.tags && Object.keys(this.tags.value).length > 0 ? this.tags.value.filter((tag: any) => !!tag.tag_id).map((tag: any) => tag.tag_id) : [];
    this.dekkService.saveCard({
      title: this.currentCardTitle,
      content_on_front: this.cardFrontEditComponent.convertCardContentToPayload(),
      content_on_back: this.cardBackEditComponent.convertCardContentToPayload(),
      dekk_id: this.currentDekkId,
      new_tags,
      selected_tag_ids
    }, this.currentCardId).subscribe((response: any) => {
      if (new_tags.length > 0) {
        this.tagsService.refreshTags();
      }
      this.router.navigate([UrlConstants.DEKK_EDIT_VIEW], {queryParams: { id: this.currentDekkId }});
    }, (error: any) => {
      this.handleCardSaveError();
    });
  }

  cardSaveMsgPopup(msg: string): void {
    const dialogRef = this.dialog.open(MsgDialogComponent, {
      data: {
          msg: msg
      }
    });
    dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed: ', result);
    });
  }

  filterTags($event: any) {
    console.log($event);
    if ($event === '') {
      this.tagOptions = this.allTagOptions;
    } else {
      const shortlistedTagOptions = this.allTagOptions.filter((tag: Tag) => tag.tag_name.toLowerCase().startsWith($event.toLowerCase()));
      this.tagOptions = shortlistedTagOptions.filter((tag: Tag) => tag.tag_name.toLowerCase().trim() === $event.toLowerCase().trim()).length === 0 ? [{
        tag_name: $event
      } as Tag].concat(shortlistedTagOptions) : shortlistedTagOptions;
      // this.tagOptions = shortlistedTagOptions;
    }
  }

  onTagSelected($event: any): void {
    if (!this.tags.value[0].tag_id) { // ie new tag
      this.allTagOptions.push(this.tags.value[0]);
    }
  }
}
