import {BottombarComponent} from '@/react/components/bottombar/bottombar';
import {ILiteEvent, LiteEvent} from '@/utils/event';

enum EditType {
    Combobox,
    CheckboxList,
    Checkbox,
    Textfield,
    Textarea,
    Numberfield,
    Label,
}

// TODO: Add combining of types

type Edit<Type> = {
    type: EditType;
    binding: keyof (Type);
    /**
     * With type = Numberfield: data[0] = min; data[1] = max;
     *
     * With type = label: data[0] = Text;
     */
    data?: any[];
};

abstract class EditModel<Type> {
    protected request_save_event: LiteEvent<void> = new LiteEvent();
    protected request_cancel_event: LiteEvent<void> = new LiteEvent();

    public get request_save(): ILiteEvent<void> {
        return this.request_save_event.expose();
    }

    public get request_cancel(): ILiteEvent<void> {
        return this.request_cancel_event.expose();
    }

    validate_and_save(object: Type, selected_object: Type | undefined): Promise<void> {
        return Promise.resolve();
    }

    abstract keys(): Edit<Type>[];

    abstract binding_key_value(binding: keyof (Type), key: string): string;

    abstract bottombar_data(): BottombarComponent[];

    abstract new(old?: Type): Type;

    abstract check_input(item: Type): Promise<void>;

    abstract to_html_body(item: Type): string;
}

export {EditModel, Edit, EditType};
