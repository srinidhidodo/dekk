import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { TablesService } from 'app/common/services/tables.service';
import { UpgradableComponent } from 'theme/components/upgradable';
import { MessageConstants } from 'app/common/constants/message.constants';
import { Subscription } from 'rxjs';
import rxmq from 'rxmq';

@Component({
  selector: 'search-results',
  styleUrls: ['./search-results.component.scss'],
  templateUrl: './search-results.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResultsComponent extends UpgradableComponent implements OnInit, OnDestroy {
  @HostBinding('class.mdl-grid') public readonly mdlGrid = true;
  @HostBinding('class.mdl-grid--no-spacing') public readonly mdlGridNoSpacing = true;

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
