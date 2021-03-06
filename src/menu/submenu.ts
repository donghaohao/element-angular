import { Component, Host, Input, OnChanges, OnInit } from '@angular/core'
import { ElMenu } from './menu'
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'el-submenu',
  template: `
    <li [ngClass]="classes()"
        (mouseenter)="mouseenterHandle()"
        (mouseleave)="mouseleaveHandle()">
      <div class="el-submenu__title" (click)="clickHandle" [style]="paddingStyle()">
        {{title}}
        <i [ngClass]="classesIcon()"></i>
      </div>
      <ul class="el-menu" [hidden]="!opened">
        <ng-content></ng-content>
      </ul>
    </li>
  `,
})
export class ElSubmenu implements OnChanges, OnInit {
  
  @Input() index: string
  @Input() title: string
  
  private timer: any
  private opened: boolean = false
  private active: boolean = false
  
  constructor(
    @Host() private rootMenu: ElMenu,
    private sanitizer: DomSanitizer,
    ) {
  }
  
  classes(): any {
    return {
      'el-submenu': true,
      'is-active': this.active,
      'is-opened': this.opened,
    }
  }
  
  classesIcon(): any {
    return {
      'el-submenu__icon-arrow': true,
      'el-icon-caret-bottom': this.rootMenu.mode === 'horizontal',
      'el-icon-arrow-down': this.rootMenu.mode === 'vertical' && !this.rootMenu.collapse,
      'el-icon-caret-right': this.rootMenu.mode === 'vertical' && this.rootMenu.collapse,
    }
  }
  
  mouseenterHandle(): void {
    this.active = this.index === this.rootMenu.toggleActive(this.index)
    
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.rootMenu.openMenu(this.index)
      this.updateOpened()
    }, 300)
    
  }
  
  mouseleaveHandle(): void {
    this.active = this.index === this.rootMenu.toggleActive()
    
    clearTimeout(this.timer)
    setTimeout(() => {
      this.rootMenu.closeMenu(this.index)
      this.updateOpened()
    }, 300)
  }
  
  updateOpened(): void {
    this.opened = this.rootMenu.openedMenus.indexOf(this.index) > -1
  }
  
  clickHandle(): void {
  
  }
  
  paddingStyle(): any {
    return this.sanitizer.bypassSecurityTrustStyle(`padding-left: 20px`)
  }
  
  ngOnChanges(changes: any): void {
    if (!changes || !changes.rootMenu) return
  }
  
  ngOnInit(): void {
    this.updateOpened()
    this.active = this.index === this.rootMenu.defaultActive
  }
  
}
