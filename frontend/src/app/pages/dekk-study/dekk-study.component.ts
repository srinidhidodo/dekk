import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { TablesService } from 'app/common/services/tables.service';
import { UpgradableComponent } from 'theme/components/upgradable';
import { MessageConstants } from 'app/common/constants/message.constants';
import { Subscription } from 'rxjs';
import rxmq from 'rxmq';

@Component({
  selector: 'dekk-study',
  styleUrls: ['./dekk-study.component.scss'],
  templateUrl: './dekk-study.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DekkStudyComponent extends UpgradableComponent implements OnInit, OnDestroy {
  @HostBinding('class.mdl-grid') public readonly mdlGrid = true;
  @HostBinding('class.mdl-grid--no-spacing') public readonly mdlGridNoSpacing = true;

  dekkCategory = 'Some Hematology-Related Category';
  cardFrontContent = 'A 10-year-old girl presents to OPD with skin lesions and a ' +
      'history of diarrhoea for 5 days. Multiple skin lesions are ' +
      'observed on the exposed  parts of the body at irregular ' +
      'intervals and are of macular and papular types.';
  cardBackContent = 'The patient is most likely suffering from Hartnup disease. The neutral ' +
      'aminoaciduria indicates a defective transport of neutral amino acid transporter in the kidneys' +
      ' and intestine resulting in failure of transport of tryptophan and other ' +
      'neutral (ie, monoaminomonocarboxylic) alpha-amino acids in the small ' +
      'intestine and the renal tubules leading to a decreased ' +
      'tryptophan for conversion into niacin leading to pellagra like symptoms.';

  visibleFront = true;
  tablesService: TablesService;
  headers: any[];
  simpleTable: any[];
  flipToFrontSubscription: Subscription;
  flipToBackSubscription: Subscription;
  
  constructor(private changeDetectorRef: ChangeDetectorRef) {
    super();
    // this.changeDetectorRef.markForCheck();
    this.tablesService = new TablesService();
    this.headers = this.tablesService.getHeaders();
    this.simpleTable = this.tablesService.getSimpleTable();

    this.flipToFrontSubscription = rxmq.channel(MessageConstants.STUDY_CHANNEL)
      .observe(MessageConstants.STUDY_FLIP_TO_FRONT_ACTION)
      .subscribe(() => { this.flipToFront(); });

    this.flipToBackSubscription = rxmq.channel(MessageConstants.STUDY_CHANNEL)
      .observe(MessageConstants.STUDY_FLIP_TO_BACK_ACTION)
      .subscribe(() => { this.flipToBack(); });
  }

  ngOnInit() {
    
  }

  ngOnDestroy() {
    // this.flipToFrontSubscription.unsubscribe();
    // this.flipToBackSubscription.unsubscribe();
  }

  flipToFront() {
    console.log('here');
    this.visibleFront = true;
    this.changeDetectorRef.detectChanges();
    console.log(this.visibleFront);
  }

  flipToBack() {
    this.visibleFront = false;
    this.changeDetectorRef.detectChanges();
    console.log(this.visibleFront);
  }

  isCardFrontVisible(): boolean {
    return this.visibleFront;
  }
}
