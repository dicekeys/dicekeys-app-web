import {SpecialTags} from "../../css";
import React from "react";
import { observer } from "mobx-react";
import { action } from "mobx";

export const CharButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={SpecialTags.CharButton} {...props} tabIndex={-1} />
);

export const CharButtonToolTip = (props: React.PropsWithChildren<{}>) => (
  <span className={SpecialTags.CharButtonToolTip}>{props.children}</span>
)

export interface CopyButtonProps {
  value?: string;
  hideCopyButton?: boolean;
}

export const CopyButton = observer ( (props: CopyButtonProps) => {
  if (props.hideCopyButton) return null;
  const copyToClipboard = action ( () => {
    if (props.value != null) {
      navigator.clipboard.writeText(props.value);
    }
    // FUTURE - provide user notification that copy happened.
  });
  return (
   <CharButton hidden={props.value == null} onClick={copyToClipboard}>&#128203;<CharButtonToolTip></CharButtonToolTip></CharButton>
  );
});

export interface ObscureButtonProps {
  obscureValue: boolean;
  toggleObscureValue: () => any;
}
const hasObscureButtonProps = (props: Partial<ObscureButtonProps>): props is ObscureButtonProps =>
  props.obscureValue !== undefined && !!props.toggleObscureValue

export const ObscureButton = observer ( (props: Partial<ObscureButtonProps>) => {
  if (!hasObscureButtonProps(props)) return null;
  return (
    <CharButton style={ props.obscureValue ? {textDecoration: "line-through"} : {}}
        onClick={props.toggleObscureValue}
    >&#x1F441;<CharButtonToolTip>{ props.obscureValue ? "show" : "hide" }</CharButtonToolTip>
    </CharButton>
  );
});
