// src/app/services/navigation/navigation.service.ts
import { Injectable, inject } from '@angular/core';
import { INavData } from '@coreui/angular';
import { AuthService } from 'src/app/services/auth/login/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private authService = inject(AuthService);

  // کش منوها
  private cachedNavItems: INavData[] | null = null;

  getNavItems(): INavData[] {
    // اگر قبلاً ساخته شده، همون رو برگردون
    if (this.cachedNavItems) {
      return this.cachedNavItems;
    }

    const hasPermission = (perm: string) => this.authService.hasPermission(perm);

    const baseChildren: INavData[] = [
      {
        name: 'کاربران',
        url: '/base/user',
        badge: { color: 'info', text: 'NEW' },
        iconComponent: { name: 'cil-user' },
        visible: hasPermission('User.View')
      }
    ].filter(item => item.visible !== false);

    const shopChildren: INavData[] = [
      {
        name: 'محصولات',
        url: '/shop/product',
        badge: { color: 'info', text: 'NEW' },
        iconComponent: { name: 'cil-basket' },
        visible: hasPermission('Product.View')
      },
      {
        name: 'واحد شمارش',
        url: '/shop/countType',
        badge: { color: 'info', text: 'NEW' },
        iconComponent: { name: 'cil-calculator' },
        visible: hasPermission('CountType.View')
      },
      {
        name: 'انبار',
        url: '/shop/inventory',
        badge: { color: 'info', text: 'NEW' },
        iconComponent: { name: 'cil-storage' },
        visible: hasPermission('Inventory.View')
      }
    ].filter(item => item.visible !== false);

    const templateChildren: INavData[] = [
      {
        name: 'Dashboard',
        url: '/template/dashboard',
        iconComponent: { name: 'cil-speedometer' },
        badge: { color: 'info', text: 'NEW' }
      },
      { title: true, name: 'Theme' },
      { name: 'Colors', url: '/template/theme/colors', iconComponent: { name: 'cil-drop' } },
      { name: 'Typography', url: '/template/theme/typography', linkProps: { fragment: 'headings' }, iconComponent: { name: 'cil-pencil' } },
      { name: 'Components', title: true },
      {
        name: 'Base',
        url: '/template/base',
        iconComponent: { name: 'cil-puzzle' },
        children: [
          { name: 'Accordion', url: '/template/base/accordion', icon: 'nav-icon-bullet' },
          { name: 'Breadcrumbs', url: '/template/base/breadcrumbs', icon: 'nav-icon-bullet' },
          { name: 'Cards', url: '/template/base/cards', icon: 'nav-icon-bullet' },
          { name: 'Carousel', url: '/template/base/carousel', icon: 'nav-icon-bullet' },
          { name: 'Collapse', url: '/template/base/collapse', icon: 'nav-icon-bullet' },
          { name: 'List Group', url: '/template/base/list-group', icon: 'nav-icon-bullet' },
          { name: 'Navs & Tabs', url: '/template/base/navs', icon: 'nav-icon-bullet' },
          { name: 'Pagination', url: '/template/base/pagination', icon: 'nav-icon-bullet' },
          { name: 'Placeholder', url: '/template/base/placeholder', icon: 'nav-icon-bullet' },
          { name: 'Popovers', url: '/template/base/popovers', icon: 'nav-icon-bullet' },
          { name: 'Progress', url: '/template/base/progress', icon: 'nav-icon-bullet' },
          { name: 'Spinners', url: '/template/base/spinners', icon: 'nav-icon-bullet' },
          { name: 'Tables', url: '/template/base/tables', icon: 'nav-icon-bullet' },
          { name: 'Tabs', url: '/template/base/tabs', icon: 'nav-icon-bullet' },
          { name: 'Tooltips', url: '/template/base/tooltips', icon: 'nav-icon-bullet' }
        ]
      },
      {
        name: 'Buttons',
        url: '/template/buttons',
        iconComponent: { name: 'cil-cursor' },
        children: [
          { name: 'Buttons', url: '/template/buttons/buttons', icon: 'nav-icon-bullet' },
          { name: 'Button groups', url: '/template/buttons/button-groups', icon: 'nav-icon-bullet' },
          { name: 'Dropdowns', url: '/template/buttons/dropdowns', icon: 'nav-icon-bullet' }
        ]
      },
      {
        name: 'Forms',
        url: '/template/forms',
        iconComponent: { name: 'cil-notes' },
        children: [
          { name: 'Form Control', url: '/template/forms/form-control', icon: 'nav-icon-bullet' },
          { name: 'Select', url: '/template/forms/select', icon: 'nav-icon-bullet' },
          { name: 'Checks & Radios', url: '/template/forms/checks-radios', icon: 'nav-icon-bullet' },
          { name: 'Range', url: '/template/forms/range', icon: 'nav-icon-bullet' },
          { name: 'Input Group', url: '/template/forms/input-group', icon: 'nav-icon-bullet' },
          { name: 'Floating Labels', url: '/template/forms/floating-labels', icon: 'nav-icon-bullet' },
          { name: 'Layout', url: '/template/forms/layout', icon: 'nav-icon-bullet' },
          { name: 'Validation', url: '/template/forms/validation', icon: 'nav-icon-bullet' }
        ]
      },
      { name: 'Charts', iconComponent: { name: 'cil-chart-pie' }, url: '/template/charts' },
      {
        name: 'Icons',
        iconComponent: { name: 'cil-star' },
        url: '/template/icons',
        children: [
          { name: 'CoreUI Free', url: '/template/icons/coreui-icons', icon: 'nav-icon-bullet', badge: { color: 'success', text: 'FREE' } },
          { name: 'CoreUI Flags', url: '/template/icons/flags', icon: 'nav-icon-bullet' },
          { name: 'CoreUI Brands', url: '/template/icons/brands', icon: 'nav-icon-bullet' }
        ]
      },
      {
        name: 'Notifications',
        url: '/template/notifications',
        iconComponent: { name: 'cil-bell' },
        children: [
          { name: 'Alerts', url: '/template/notifications/alerts', icon: 'nav-icon-bullet' },
          { name: 'Badges', url: '/template/notifications/badges', icon: 'nav-icon-bullet' },
          { name: 'Modal', url: '/template/notifications/modal', icon: 'nav-icon-bullet' },
          { name: 'Toast', url: '/template/notifications/toasts', icon: 'nav-icon-bullet' }
        ]
      },
      {
        name: 'Widgets',
        url: '/template/widgets',
        iconComponent: { name: 'cil-calculator' },
        badge: { color: 'info', text: 'NEW' }
      },
      { title: true, name: 'Extras' },
      {
        name: 'Pages',
        url: '/template/login',
        iconComponent: { name: 'cil-star' },
        children: [
          { name: 'Login', url: '/template/login', icon: 'nav-icon-bullet' },
          { name: 'Register', url: '/template/register', icon: 'nav-icon-bullet' },
          { name: 'Error 404', url: '/template/404', icon: 'nav-icon-bullet' },
          { name: 'Error 500', url: '/template/500', icon: 'nav-icon-bullet' }
        ]
      },
      { title: true, name: 'Links', class: 'mt-auto' },
      {
        name: 'Docs',
        url: 'https://coreui.io/angular/docs/',
        iconComponent: { name: 'cil-description' },
        attributes: { target: '_blank' }
      }
    ];

    const navItems: INavData[] = [
      { title: true, name: 'اصلی' },

      ...(baseChildren.length > 0 ? [{
        name: 'پایه',
        url: '/base',
        iconComponent: { name: 'cil-cart' },
        children: baseChildren
      }] : []),

      ...(shopChildren.length > 0 ? [{
        name: 'فروشگاه',
        url: '/shop',
        iconComponent: { name: 'cil-cart' },
        children: shopChildren
      }] : []),

      {
        name: 'قالب',
        url: '/template',
        iconComponent: { name: 'cil-puzzle' },
        children: templateChildren
      }
    ];

    // کش کردن
    this.cachedNavItems = navItems;
    return navItems;
  }

  // متد برای پاک کردن کش (مثلاً بعد از لاگین/لاگ‌اوت)
  invalidateCache(): void {
    this.cachedNavItems = null;
  }
}