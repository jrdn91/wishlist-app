import type { FieldValues, UseControllerProps } from "react-hook-form"
import { Controller } from "react-hook-form"
import type { TextInputProps } from "react-native"
import { Text, TextInput } from "react-native"

export interface ControlledTextFieldProps<FieldValueProps extends FieldValues>
  extends UseControllerProps<FieldValueProps>,
    Omit<TextInputProps, "defaultValue"> {}

function ControlledTextField<FieldValueProps extends FieldValues>({
  control,
  name,
  ...props
}: ControlledTextFieldProps<FieldValueProps>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        fieldState: { error },
        field: { onChange, onBlur, value },
      }) => (
        <>
          <TextInput
            value={value}
            onChangeText={(newValue) => onChange(newValue)}
            onBlur={onBlur}
            {...props}
            style={[
              props.style,
              {
                borderColor: error ? "red" : "gray",
                borderWidth: 1,
                padding: 8,
              },
            ]}
          />
          {error?.message && (
            <Text style={{ color: "red" }}>{error.message}</Text>
          )}
        </>
      )}
    />
  )
}

export default ControlledTextField
