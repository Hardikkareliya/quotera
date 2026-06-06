"use client";

import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Controller,
  useFieldArray,
  useWatch,
  type Control,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";

import { MarkdownTextarea } from "@/components/documents/markdown-textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  GST_PRESET_RATES,
  isPresetGstRate,
  type PricingMode,
} from "@/lib/line-items";
import { formatINR, parseDecimalToPaise } from "@/lib/money";
import { cn } from "@/lib/utils";

export type LineItemsFormValues = {
  items: Array<{
    description: string;
    subDescription: string;
    hsnSac: string;
    pricingMode: PricingMode;
    qty: string;
    unitPrice: string;
    taxRate: string;
  }>;
};

function newQtyRateLine(taxEnabled: boolean) {
  return {
    description: "",
    subDescription: "",
    hsnSac: "",
    pricingMode: "qty_rate" as const,
    qty: "1",
    unitPrice: "0",
    taxRate: taxEnabled ? "18" : "0",
  };
}

function newFixedLine(taxEnabled: boolean) {
  return {
    ...newQtyRateLine(taxEnabled),
    pricingMode: "fixed" as const,
    qty: "1",
    unitPrice: "0",
    taxRate: "0",
  };
}

function lineAmountSummary(item: LineItemsFormValues["items"][number]): string {
  const mode = item.pricingMode ?? "qty_rate";
  const qty = parseFloat(String(item.qty ?? "1").replace(/,/g, "")) || 0;
  const rate = parseDecimalToPaise(item.unitPrice);
  const paise = mode === "fixed" ? rate : Math.round(qty * rate);
  return formatINR(paise);
}

function GstRateField({
  index,
  register,
  rate,
  setValue,
}: {
  index: number;
  register: UseFormRegister<LineItemsFormValues>;
  rate: string;
  setValue: UseFormSetValue<LineItemsFormValues>;
}) {
  const preset = isPresetGstRate(rate) ? rate : "custom";
  const isCustom = preset === "custom";

  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">Tax %</Label>
      <Select
        fieldSize="compact"
        value={preset}
        onChange={(e) => {
          const v = e.target.value;
          if (v !== "custom") {
            setValue(`items.${index}.taxRate`, v);
          } else if (isPresetGstRate(rate)) {
            setValue(`items.${index}.taxRate`, "");
          }
        }}
      >
        <option value="0">No tax</option>
        {GST_PRESET_RATES.filter((r) => r !== "0").map((r) => (
          <option key={r} value={r}>
            {r}%
          </option>
        ))}
        <option value="custom">Other…</option>
      </Select>
      {isCustom ? (
        <Input
          type="number"
          min={0}
          max={100}
          step="0.01"
          placeholder="e.g. 9"
          className="h-9"
          {...register(`items.${index}.taxRate`)}
        />
      ) : null}
    </div>
  );
}

function PricingModeToggle({
  isFixed,
  onQtyRate,
  onFixed,
}: {
  isFixed: boolean;
  onQtyRate: () => void;
  onFixed: () => void;
}) {
  return (
    <div className="inline-flex shrink-0 rounded-md border border-border bg-muted/30 p-0.5">
      <button
        type="button"
        className={cn(
          "rounded px-2 py-1 text-[11px] font-medium transition-colors",
          !isFixed
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
        onClick={onQtyRate}
      >
        Qty × rate
      </button>
      <button
        type="button"
        className={cn(
          "rounded px-2 py-1 text-[11px] font-medium transition-colors",
          isFixed
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
        onClick={onFixed}
      >
        Fixed
      </button>
    </div>
  );
}

type LineItemRowProps = {
  index: number;
  fieldId: string;
  isExpanded: boolean;
  canCollapse: boolean;
  taxEnabled: boolean;
  control: Control<LineItemsFormValues>;
  register: UseFormRegister<LineItemsFormValues>;
  setValue: UseFormSetValue<LineItemsFormValues>;
  item: LineItemsFormValues["items"][number] | undefined;
  onToggle: () => void;
  onRemove: () => void;
  canRemove: boolean;
};

function LineItemRow({
  index,
  isExpanded,
  canCollapse,
  taxEnabled,
  control,
  register,
  setValue,
  item,
  onToggle,
  onRemove,
  canRemove,
}: LineItemRowProps) {
  const mode = item?.pricingMode ?? "qty_rate";
  const isFixed = mode === "fixed";
  const taxRate = item?.taxRate ?? "0";
  const title = item?.description?.trim() || `Item ${index + 1}`;
  const amountGridClass = taxEnabled
    ? "grid grid-cols-2 gap-2 sm:grid-cols-3"
    : "grid grid-cols-2 gap-2";

  if (!isExpanded && canCollapse) {
    return (
      <div className="flex items-center gap-2 px-3 py-2.5 sm:px-4">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
          {index + 1}
        </span>
        <button
          type="button"
          className="min-w-0 flex-1 text-left"
          onClick={onToggle}
        >
          <p className="truncate text-sm font-medium text-foreground">{title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {isFixed ? "Fixed amount" : `Qty ${item?.qty ?? "1"} × rate`}
            {" · "}
            {lineAmountSummary(
              item ?? {
                description: "",
                subDescription: "",
                hsnSac: "",
                pricingMode: "qty_rate",
                qty: "1",
                unitPrice: "0",
                taxRate: "0",
              },
            )}
            {taxEnabled && taxRate !== "0" ? ` · ${taxRate}% tax` : null}
          </p>
        </button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0"
          onClick={onToggle}
          aria-label="Expand item"
        >
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0"
          onClick={onRemove}
          disabled={!canRemove}
          aria-label="Remove line"
        >
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3 px-3 py-3 sm:px-4">
      <div className="flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {index + 1}
        </span>
        <PricingModeToggle
          isFixed={isFixed}
          onQtyRate={() => {
            setValue(`items.${index}.pricingMode`, "qty_rate");
            if (!item?.qty) setValue(`items.${index}.qty`, "1");
          }}
          onFixed={() => {
            setValue(`items.${index}.pricingMode`, "fixed");
            setValue(`items.${index}.qty`, "1");
          }}
        />
        <div className="flex-1" />
        {canCollapse ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            onClick={onToggle}
            aria-label="Collapse item"
          >
            <ChevronDown className="size-4 rotate-180 text-muted-foreground" />
          </Button>
        ) : null}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0"
          onClick={onRemove}
          disabled={!canRemove}
          aria-label="Remove line"
        >
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </div>

      <div className="space-y-2">
        <Input
          className="h-9"
          placeholder="Enter item or service name"
          {...register(`items.${index}.description`)}
        />
        <Controller
          control={control}
          name={`items.${index}.subDescription`}
          render={({ field }) => (
            <MarkdownTextarea
              id={`item-sub-${index}`}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              placeholder="Enter description"
              rows={2}
              compact
            />
          )}
        />
      </div>

      <div className={amountGridClass}>
        {isFixed ? (
          <div className={taxEnabled ? "sm:col-span-2" : "col-span-2"}>
            <Label className="text-xs text-muted-foreground">Amount (₹)</Label>
            <Input
              className="mt-1.5 h-9"
              inputMode="decimal"
              placeholder="25000"
              {...register(`items.${index}.unitPrice`)}
            />
          </div>
        ) : (
          <>
            <div>
              <Label className="text-xs text-muted-foreground">Qty</Label>
              <Input
                className="mt-1.5 h-9"
                inputMode="decimal"
                {...register(`items.${index}.qty`)}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Rate (₹)</Label>
              <Input
                className="mt-1.5 h-9"
                inputMode="decimal"
                {...register(`items.${index}.unitPrice`)}
              />
            </div>
          </>
        )}
        {taxEnabled ? (
          <GstRateField
            index={index}
            register={register}
            rate={taxRate}
            setValue={setValue}
          />
        ) : null}
      </div>
    </div>
  );
}

type Props = {
  control: Control<LineItemsFormValues>;
  register: UseFormRegister<LineItemsFormValues>;
  setValue: UseFormSetValue<LineItemsFormValues>;
  taxEnabled: boolean;
};

export function LineItemsEditor({
  control,
  register,
  setValue,
  taxEnabled,
}: Props) {
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const items = useWatch({ control, name: "items" });
  const [expandedIndex, setExpandedIndex] = useState(0);

  const canCollapse = fields.length > 1;

  useEffect(() => {
    if (fields.length === 1) {
      setExpandedIndex(0);
    } else if (expandedIndex >= fields.length) {
      setExpandedIndex(fields.length - 1);
    }
  }, [fields.length, expandedIndex]);

  function appendLine(factory: (taxEnabled: boolean) => LineItemsFormValues["items"][number]) {
    append(factory(taxEnabled));
    setExpandedIndex(fields.length);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label className="text-base">Line items</Label>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendLine(newQtyRateLine)}
          >
            <Plus className="size-4" />
            Qty × rate
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendLine(newFixedLine)}
          >
            <Plus className="size-4" />
            Fixed amount
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className={cn(
              "border-border",
              index > 0 && "border-t",
              expandedIndex === index && canCollapse && "bg-muted/20",
            )}
          >
            <LineItemRow
              index={index}
              fieldId={field.id}
              isExpanded={!canCollapse || expandedIndex === index}
              canCollapse={canCollapse}
              taxEnabled={taxEnabled}
              control={control}
              register={register}
              setValue={setValue}
              item={items?.[index]}
              onToggle={() =>
                setExpandedIndex(expandedIndex === index ? -1 : index)
              }
              onRemove={() => remove(index)}
              canRemove={fields.length > 1}
            />
          </div>
        ))}
      </div>

    </div>
  );
}
