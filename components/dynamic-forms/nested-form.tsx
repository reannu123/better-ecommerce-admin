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
}
export const NestedForm: React.FC<NestedFormProps> = ({ nestIndex, form }) => {
  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: `variants.${nestIndex}.options`,
  });

  return (
    <Card className="space-y-4">
      <CardHeader className="p-4 pb-0">
        <FormLabel>Option Values</FormLabel>
      </CardHeader>
      <CardContent className="space-y-4 px-4">
        {fields.map((item, k) => {
          return (
            <div key={item.id}>
              <FormField
                control={form.control}
                name={`variants.${nestIndex}.options.${k}.name`}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex space-x-3">
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
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          );
        })}
        <Button
          variant={"default"}
          type="button"
          onClick={() => append({ name: "" })}
          className="w-full"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
};
