import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VideoPlayerGeneratorComponent } from './video-player-generator.component';

xdescribe('VideoPlayerGeneratorComponent', () => {
  let component: VideoPlayerGeneratorComponent;
  let fixture: ComponentFixture<VideoPlayerGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VideoPlayerGeneratorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoPlayerGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
