import {BottombarComponent} from '@/react/components/bottombar/bottombar';
import {EditModel} from '@/react/components/listview/model/edit_model';
import {SummaryModel} from '@/react/components/listview/model/preview_model';
import {ILiteEvent, LiteEvent} from '@/utils/event';

class ItemContainer<ItemType> {
    constructor(public data: ItemType,
                public id: ItemId,
    ) {
    }
}

type ListPreview<Binding> = {
    display: string;
    binding: keyof (Binding);
    sortable?: boolean;
};

type ItemId = number;

// TODO: add sorting
// TODO: add adding/editing

abstract class List<ItemType> {

    protected trigger_filter_event: LiteEvent<void> = new LiteEvent();
    protected request_change_event: LiteEvent<void> = new LiteEvent();
    protected item_clicked_event: LiteEvent<ItemId> = new LiteEvent();

    public get trigger_filter(): ILiteEvent<void> {
        return this.trigger_filter_event.expose();
    }

    public get request_change(): ILiteEvent<void> {
        return this.request_change_event.expose();
    }

    public get item_clicked(): ILiteEvent<ItemId> {
        return this.item_clicked_event.expose();
    }

    private items: Map<ItemId, ItemContainer<ItemType>> = new Map<ItemId, ItemContainer<ItemType>>();
    private id = 0;

    abstract summary_model: SummaryModel<ItemType>;
    abstract list_preview: ListPreview<ItemType>[];
    edit_model?: EditModel<ItemType>;

    public get_item(id: ItemId): ItemContainer<ItemType> | undefined {
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

    all_items(): ItemId[] {
        return this.sorted_filtered_items();
    }

    body_item_clicked(item: ItemId): void {
        this.item_clicked_event.invoke(item);
    }

    header_item_clicked(binding: keyof (ItemType)): void {
    }

    protected sorted_filtered_items(): ItemId[] {
        return Array.from(this.items.keys());
    }

    abstract text_from_binding(item: ItemId, binding: keyof (ItemType)): string;

    abstract bottombar_data(): BottombarComponent[];
}

export {List, ListPreview, ItemId};
