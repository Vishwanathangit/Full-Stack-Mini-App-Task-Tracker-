import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, error, value, defaultValue, onChange, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const selectRef = React.useRef<HTMLSelectElement>(null);

    // Combine external ref with our internal ref
    React.useImperativeHandle(ref, () => selectRef.current!);

    // Extract options from children
    const options = React.useMemo(() => {
      return React.Children.toArray(children)
        .map((child) => {
          if (React.isValidElement(child) && child.type === 'option') {
            const props = child.props as any;
            return {
              value: (props.value ?? '') as string,
              label: (props.children ?? '') as string,
              disabled: !!props.disabled,
            };
          }
          return null;
        })
        .filter((opt): opt is { value: string; label: string; disabled: boolean } => opt !== null);
    }, [children]);

    // Track active value
    const [selectedValue, setSelectedValue] = React.useState<string>(() => {
      if (value !== undefined) return value as string;
      if (defaultValue !== undefined) return defaultValue as string;
      return options[0]?.value ?? '';
    });

    // Sync state when controlled value changes
    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value as string);
      }
    }, [value]);

    // Handle click outside to close
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === selectedValue);

    const handleSelect = (val: string) => {
      setSelectedValue(val);
      setIsOpen(false);

      if (selectRef.current) {
        selectRef.current.value = val;
        // Dispatch a synthetic change event to trigger react-hook-form / onChange
        const event = new Event('change', { bubbles: true });
        selectRef.current.dispatchEvent(event);
      }

      if (onChange) {
        const syntheticEvent = {
          target: {
            value: val,
            name: props.name,
          },
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange(syntheticEvent);
      }
    };

    return (
      <div ref={containerRef} className="relative w-full">
        {/* Hidden native select for form integration */}
        <select
          ref={selectRef}
          value={selectedValue}
          onChange={onChange}
          className="sr-only"
          {...props}
        >
          {children}
        </select>

        {/* Custom Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary shadow-sm transition-all focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus disabled:cursor-not-allowed disabled:opacity-50 text-left cursor-pointer',
            error && 'border-danger focus:ring-danger focus:border-danger',
            className
          )}
          disabled={props.disabled}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : 'Select...'}
          </span>
          <ChevronDown className="h-4 w-4 text-text-muted shrink-0 transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }} />
        </button>

        {/* Custom Dropdown Content */}
        {isOpen && (
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-surface p-1 shadow-xl animate-in fade-in-50 slide-in-from-top-1 duration-100">
            {options.map((option) => {
              const isSelected = option.value === selectedValue;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  className={cn(
                    'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors text-text-secondary hover:bg-surface-raised hover:text-text-primary disabled:pointer-events-none disabled:opacity-50 text-left',
                    isSelected && 'text-text-primary bg-surface-raised/50 font-medium'
                  )}
                  disabled={option.disabled}
                >
                  {isSelected && (
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      <Check className="h-4 w-4 text-primary" />
                    </span>
                  )}
                  <span className="truncate">{option.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select };
