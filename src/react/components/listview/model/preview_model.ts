import {BottombarComponent} from '@/react/components/bottombar/bottombar';
import {ILiteEvent, LiteEvent} from '@/utils/event';

abstract class SummaryModel<Type> {
    protected request_edit_event: LiteEvent<void> = new LiteEvent();
    protected request_new_event: LiteEvent<void> = new LiteEvent();

    public get request_edit(): ILiteEvent<void> {
        return this.request_edit_event.expose();
    }
    public get request_new(): ILiteEvent<void> {
        return this.request_new_event.expose();
    }

    abstract text_from_key(key: keyof Type): string;

    abstract text_from_value(key: keyof Type, item: Type): string;

    abstract keys(): (keyof Type)[];

    abstract bottombar_data(): BottombarComponent[];
}

export {SummaryModel};
