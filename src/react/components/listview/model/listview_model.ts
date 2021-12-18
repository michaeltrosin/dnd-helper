import { BottombarComponent } from '@/react/components/bottombar/bottombar';
import { EditModel } from '@/react/components/listview/model/edit_model';
import { SummaryModel } from '@/react/components/listview/model/preview_model';
import { Model } from '@/react/components/model';
import { ILiteEvent, LiteEvent } from '@/utils/event';
import { NestedKeyOf } from '@/utils/generics';

type ItemId = number;

class ItemContainer<ItemType> {
    constructor(public data: ItemType,
        public id: ItemId,
    ) {
    }
}

type ListPreview<Binding> = {
    display: string;
    binding: NestedKeyOf<Binding>;
    sortable?: boolean;
};

type FilterType = {
    binding?: any;
    bounds: any[];
    data: any[];
};

abstract class ListModel<ItemType> extends Model<ItemType> {
    protected triggerFilterEvent: LiteEvent<void> = new LiteEvent();
    protected requestChangeEvent: LiteEvent<void> = new LiteEvent();
    protected itemClickedEvent: LiteEvent<ItemId> = new LiteEvent();

    public get triggerFilter(): ILiteEvent<void> {
        return this.triggerFilterEvent.expose();
    }

    public get requestChange(): ILiteEvent<void> {
        return this.requestChangeEvent.expose();
    }

    public get itemClicked(): ILiteEvent<ItemId> {
        return this.itemClickedEvent.expose();
    }

    private items: Map<ItemId, ItemContainer<ItemType>> = new Map<ItemId, ItemContainer<ItemType>>();
    private id = 0;

    protected get Items(): Map<ItemId, ItemContainer<ItemType>> {
        return this.items;
    }

    abstract summaryModel: SummaryModel<ItemType>;
    abstract listPreview: ListPreview<ItemType>[];
    editModel?: EditModel<ItemType>;

    filterData?: Map<NestedKeyOf<ItemType>, FilterType>;

    public getItem(id: ItemId): ItemContainer<ItemType> | undefined {
        if (id === -1) {
            return undefined;
        }
        return this.items.get(id);
    }

    add(item: ItemType): void {
        const id = this.id++;
        this.items.set(id, new ItemContainer(item, id));
    }

    set(index: number, item: ItemType): void {
        this.items.set(index, new ItemContainer(item, index));
    }

    add_all(...items: ItemType[]): void {
        for (const itm of items) {
            this.add(itm);
        }
    }

    clear(): void {
        this.items.clear();
        this.id = 0;
    }

    allItems(): ItemId[] {
        return this.sortedFilteredItems();
    }

    bodyItemClicked(item: ItemId): void {
        this.itemClickedEvent.invoke(item);
    }

    headerItemClicked(binding: NestedKeyOf<ItemType>): void {
        //
    }

    protected sortedFilteredItems(): ItemId[] {
        return Array.from(this.Items.keys());
    }

    abstract textFromBingind(item: ItemId, binding: NestedKeyOf<ItemType>): string;

    abstract bottombarData(): BottombarComponent[];
}

export { ListModel, ListPreview, ItemId, FilterType };
