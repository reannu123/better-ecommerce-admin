"use client";
import React from "react";
import { useFieldArray } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Plus, Trash } from "lucide-react";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface NestedFormProps {
  nestIndex: number;
  form: any;
  register: any;
}
export const NestedForm: React.FC<NestedFormProps> = ({
  nestIndex,
  form,
  register,
}) => {
  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: `variants.${nestIndex}.options`,
  });

  return (
    <div className="space-y-4">
      {fields.map((item, k) => {
        return (
          <div
            key={item.id}
            className="flex items-center space-x-3"
          >
            <Card className="flex-grow flex-basis-0">
              <FormField
                control={form.control}
                name={`variants.${nestIndex}.options.${k}.name`}
                render={({ field }) => (
                  <FormItem>
                    <CardHeader className="p-4 pb-0">
                      <FormLabel>Option Value</FormLabel>
                    </CardHeader>
                    <CardContent className="flex items-center space-x-3 px-4 pb-4">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Small"
                        />
                      </FormControl>

                      {k > 0 && (
                        <Button
                          onClick={() => remove(k)}
                          type="button"
                          variant="destructive"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      )}
                    </CardContent>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>

            <Button
              variant={"default"}
              type="button"
              onClick={() => append({ name: "" })}
              className="flex-grow-2 flex-basis-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        );
      })}

      <div className="flex justify-end"></div>
    </div>
  );
};
