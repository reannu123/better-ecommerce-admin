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
import { Trash } from "lucide-react";
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
          <Card key={item.id}>
            <FormField
              key={item.id}
              control={form.control}
              name={`variants.${nestIndex}.options.${k}.name`}
              render={({ field }) => (
                <FormItem>
                  <CardHeader>
                    <CardTitle>
                      <FormLabel>Option Value</FormLabel>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center space-x-2">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Option value"
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
        );
      })}

      <Button
        variant={"outline"}
        type="button"
        onClick={() => append({ name: "" })}
      >
        Add Option
      </Button>
    </div>
  );
};
