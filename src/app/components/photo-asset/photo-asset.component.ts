import { Component, computed, input, OnInit, output } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-photo-asset',
  templateUrl: './photo-asset.component.html',
  imports: [],
  styleUrls: ['./photo-asset.component.scss'],
})
export class PhotoAssetComponent implements OnInit {

  photoUrl = input<string>();
  deleted = output<void>();

  photoUrlResolved = computed(() => `${environment.uploadedHost}${this.photoUrl()}`);

  ngOnInit() {
  }
}
