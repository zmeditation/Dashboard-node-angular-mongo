import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VideoPlayerGeneratorControlsComponent } from './video-player-generator-controls.component';

xdescribe('VideoPlayerGeneratorControlsComponent', () => {
  let component: VideoPlayerGeneratorControlsComponent;
  let fixture: ComponentFixture<VideoPlayerGeneratorControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VideoPlayerGeneratorControlsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoPlayerGeneratorControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
