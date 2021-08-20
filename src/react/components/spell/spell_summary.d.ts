import { Component } from "react";
import { ISpell } from "./model/spell_model";
import '@/utils/extensions';
declare type Props = {
    spell: ISpell;
};
export declare class SpellSumary extends Component<Props, any> {
    constructor(props: Props);
    render(): JSX.Element;
}
export {};
