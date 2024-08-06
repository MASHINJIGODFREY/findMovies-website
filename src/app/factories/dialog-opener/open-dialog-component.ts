import { ComponentType } from "@angular/cdk/portal";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

export class OpenDialogComponent {

  static execute(dialog: MatDialog, component: ComponentType<any>, data: any): MatDialogRef<any, any>{
    return dialog.open(component, {
      closeOnNavigation: true,
      data: data,
      maxHeight: 'auto',
      maxWidth: '400px',
      minWidth: 'calc(400px - 80%)'
    });
  }
}
