import { Button } from '#components/ui/button.tsx';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '#components/ui/dropdown-menu.tsx';
import { ChevronDown } from 'lucide-react';
import { Glowing } from './styling/glowing';
import { APPS } from '#types/ENUMS.ts';

export interface CustomDropdownItem {
  id: number;
  name: string;
}

interface CustomDropdownProps {
  title: string | null;
  items: CustomDropdownItem[];
  picked: string;
  setState: (item: CustomDropdownItem) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  title,
  items,
  picked,
  setState,
}) => {
  return (
    <div className="w-full flex flex-col gap-2 items-start">
      <span className="w-full text-sm font-medium">{title}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`
              w-full shadow-none flex justify-between items-center hover:text-[var(--primary)] hover:bg-[var(--highlight)]
              ${Glowing(APPS.PORTAL).dropdown}
            `}
          >
            <div className="flex-1 text-left">{picked || '\u00A0'}</div>
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-full"
          style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}
        >
          {items.map((item) => (
            <DropdownMenuCheckboxItem
              key={item.id}
              className={`${Glowing(APPS.PORTAL).dropdownItem}`}
              // className={styles.customDropdownItem}
              checked={item.name === picked}
              onCheckedChange={() => {
                setState(item);
              }}
            >
              {item.name}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CustomDropdown;
