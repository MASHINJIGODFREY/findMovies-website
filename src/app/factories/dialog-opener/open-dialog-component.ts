import { ComponentType } from "@angular/cdk/portal";
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from "@angular/material/legacy-dialog";

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
