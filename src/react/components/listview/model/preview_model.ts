import { BottombarComponent } from '@/react/components/bottombar/bottombar';
import { ILiteEvent, LiteEvent } from '@/utils/event';
import { NestedKeyOf } from '@/utils/generics';

abstract class SummaryModel<Type> {
    protected requestEditEvent: LiteEvent<void> = new LiteEvent();
    protected requestNewEvent: LiteEvent<void> = new LiteEvent();

    public get requestEdit(): ILiteEvent<void> {
        return this.requestEditEvent.expose();
    }

    public get requestNew(): ILiteEvent<void> {
        return this.requestNewEvent.expose();
    }

    abstract textFromKey(key: NestedKeyOf<Type>): string;

    abstract textFromValue(key: NestedKeyOf<Type>, item: Type): string;

    abstract keys(): (NestedKeyOf<Type>)[];

    abstract bottombarData(): BottombarComponent[];
}

export { SummaryModel };
