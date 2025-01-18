import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[appIfNot]',
    standalone: false
})
export class IfNotDirective {

  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) { }

  @Input() set appIfNot(condition: boolean){
    if(!condition){
      this.viewContainer.createEmbeddedView(this.templateRef);
    }else{
      this.viewContainer.clear();
    }
  }

}
