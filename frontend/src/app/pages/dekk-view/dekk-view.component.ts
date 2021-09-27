import { Component, HostBinding } from '@angular/core';
import { TablesService } from 'app/common/services/tables.service';

import { UpgradableComponent } from 'theme/components/upgradable';

@Component({
  selector: 'dekk-view',
  styleUrls: ['./dekk-view.component.scss'],
  templateUrl: './dekk-view.component.html',
})
export class DekkViewComponent extends UpgradableComponent {
  @HostBinding('class.mdl-grid') public readonly mdlGrid = true;
  @HostBinding('class.mdl-grid--no-spacing') public readonly mdlGridNoSpacing = true;

  dekkName = 'Hemat-Oncology';
  numOfCardsInDekk = 25;

  // todo - replace with actual data
  tablesService = new TablesService();
  headers = this.tablesService.getHeaders();
  simpleTable = this.tablesService.getSimpleTable();
}
