import { Directive, ElementRef, Input, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[ng-sticky]'
})
export class NgStickyDirective {

  private sticked: boolean = true;
  private selectedOffset: number = 0;
  private windowOffsetTop: number = 0;

  @Input() addClass: string = '';
  @Input() offSet: number = 0;

  constructor(private el: ElementRef, private render:Renderer2) {
    this.selectedOffset = this.el.nativeElement.offsetTop;
  }
    
  @HostListener('window:scroll', ['$event'])
  @HostListener('window:resize', ['$event'])
  @HostListener('window:orientationchange', ['$event'])
  onChange(): void {
      this.scroll();
  }

  ngOnInit() {
    window.addEventListener('scroll', this.scroll, true); //third parameter
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
  }


  private addSticky() {
    this.sticked = true;
    //this.el.nativeElement.style.position = 'fixed';
    this.el.nativeElement.style.position = '-webkit-sticky';    
    this.el.nativeElement.style.position = '-moz-sticky';
    this.el.nativeElement.style.position = '-ms-sticky';
    this.el.nativeElement.style.position = 'sticky';
    this.el.nativeElement.style.top = this.offSet + 'px';

    if (this.addClass.length > 0)
    {
        let classArr = this.addClass.split(" ");
        for (var i = 0; i < classArr.length; i++) {
            this.render.addClass(this.el.nativeElement, classArr[i]);
        }
    }
    
    
  }

  private removeSticky() {
      this.sticked = false;
      this.el.nativeElement.style.position = '';

      if (this.addClass.length > 0) {
          let classArr = this.addClass.split(" ");
          for (var i = 0; i < classArr.length; i++) {
              this.render.removeClass(this.el.nativeElement, classArr[i]);
          }
      }
  }

  scroll = (): void => {
    
      let offset: number = this.el.nativeElement.offsetTop;
      this.windowOffsetTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

      if (this.selectedOffset === 0) {
        this.selectedOffset = offset;
      }

      if (this.sticked === false) {
        this.selectedOffset = offset;
      }

      if ((this.windowOffsetTop + this.offSet) > this.selectedOffset) {
        
        this.addSticky();
      } else {
        this.removeSticky();
      }
    }
}
