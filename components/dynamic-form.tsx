"use client";

import {
  Box,
  Button,
  Field,
  Fieldset,
  Input,
  NativeSelect,
  SimpleGrid,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import type { BoxProps, SimpleGridProps } from "@chakra-ui/react";
import { useMemo, useState } from "react";

type FieldOption = {
  label: string;
  value: string;
};

export type DynamicField =
  | ({
      type?: "text" | "email" | "number" | "tel" | "date" | "password";
    } & BaseField)
  | ({ type: "textarea" } & BaseField)
  | ({ type: "select"; options: FieldOption[] } & BaseField);

type BaseField = {
  name: string;
  label: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  defaultValue?: string;
};

export type DynamicFormValues = Record<string, string>;

type DynamicFormProps = {
  fields: DynamicField[];
  legend?: string;
  description?: string;
  submitLabel?: string;
  initialValues?: DynamicFormValues;
  onSubmit?: (values: DynamicFormValues) => void | Promise<void>;
  size?: "sm" | "md" | "lg";
  maxWidth?: string | number;
  columns?: SimpleGridProps["columns"];
  gap?: SimpleGridProps["gap"];
  contentPadding?: BoxProps["p"];
  formPadding?: BoxProps["p"];
};

export const DynamicForm = ({
  fields,
  legend = "Details",
  description,
  submitLabel = "Submit",
  initialValues,
  onSubmit,
  size = "lg",
  maxWidth = "md",
  columns = { base: 1, md: 2 },
  gap = 6,
  contentPadding = { base: 2, md: 4 },
  formPadding = { base: 4, md: 6 },
}: DynamicFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState<DynamicFormValues>(() => {
    const defaults: DynamicFormValues = {};
    fields.forEach((field) => {
      defaults[field.name] =
        initialValues?.[field.name] ?? field.defaultValue ?? "";
    });
    return defaults;
  });

  const fieldLookup = useMemo(
    () => new Set(fields.map((field) => field.name)),
    [fields]
  );

  const handleChange = (name: string, value: string) => {
    if (!fieldLookup.has(name)) return;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!onSubmit) return;

    try {
      setIsSubmitting(true);
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderControl = (field: DynamicField) => {
    const commonProps = {
      name: field.name,
      placeholder: field.placeholder,
      value: values[field.name] ?? "",
      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        handleChange(field.name, event.target.value),
    };

    if (field.type === "textarea") {
      return <Textarea {...commonProps} />;
    }

    if (field.type === "select") {
      return (
        <NativeSelect.Root>
          <NativeSelect.Field
            name={field.name}
            value={values[field.name] ?? ""}
            onChange={(event) => handleChange(field.name, event.target.value)}
          >
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      );
    }

    const inputType = field.type ?? "text";

    return <Input type={inputType} {...commonProps} />;
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Box p={formPadding}>
        <Fieldset.Root size={size} maxW={maxWidth}>
          <Stack gap={2}>
            <Fieldset.Legend className="text-xl font-semibold md:text-2xl">
              {legend}
            </Fieldset.Legend>
            {description ? (
              <Fieldset.HelperText>{description}</Fieldset.HelperText>
            ) : null}
          </Stack>

          <Fieldset.Content>
            <Box p={contentPadding}>
              <SimpleGrid columns={columns} gap={gap}>
                {fields.map((field) => (
                  <Field.Root key={field.name} required={field.required}>
                    <Field.Label>{field.label}</Field.Label>
                    {renderControl(field)}
                    {field.helperText ? (
                      <Field.HelperText>{field.helperText}</Field.HelperText>
                    ) : null}
                  </Field.Root>
                ))}
              </SimpleGrid>
            </Box>
          </Fieldset.Content>

          <Button
            type="submit"
            alignSelf="center"
            loading={isSubmitting}
            loadingText="Submitting"
          >
            {submitLabel}
          </Button>
        </Fieldset.Root>
      </Box>
    </form>
  );
};

