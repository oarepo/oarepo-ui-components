import React, { ReactNode } from "react";
import { Formik, FormikHelpers, FormikProps } from "formik";
import { Button, Label } from "semantic-ui-react";

/**
 * Object for keeping track of form values.
 */
export interface Values {
    /**
     * Determines, which submit action will be invoked (by looking it up in `OARepoDepositForm.formActions` prop),
     * when a Formik form is submitted.
     */
    contextualSubmitAction: FormSubmitAction;
}

/**
 * Form onSubmit action handler.
 */
export type FormSubmitAction = (
    values: Values,
    formikBag: FormikHelpers<Values>
) => void | Promise<any>;

/**
 * Supported onSubmit action handlers on a form.
 */
export interface FormActions<T> {
    [key: string]: T;
}

interface OARepoDepositFormProps {
    /**
     * Form submission handler. It is passed your forms values and the "FormikBag",
     * which includes an object containing a subset of the injected props and methods
     * (i.e. all the methods with names that start with set... + resetForm) and any props that were passed to the wrapped component.
     * 
     * **NOTE:** Setting this prop prevents any other contextual submit formActions to be run.
     */
    onSubmit: FormSubmitAction;
    /**
     * String-indexed registry of available contextual form actions invoked upon submitting.
     * Each action has the same signature as the `onSubmit` submission handler.
     * 
     * **Default actions**:
     * ```
     * submit: (value: Values, formikBag: FormikHelpers<Values>) => onSubmit(value, formikBag),
     * ```
     */
    formActions?: FormActions<FormSubmitAction>;
    /**
     * Initial field values of the form, Formik will make these values available to render methods component as values.
     *
     * **Default values**:
     * ```
     * { contextualSubmitAction: formActions.noop }
     * ```
     */
    initialValues?: Values;
    /**
     * Formik children components rendered inside a Formik form. E.g. Fields and sections.
     */
    children?: ReactNode;
}

interface FormikOuterProps {
    /**
     * Formik Values field name for determining form action function. 
     */
    formActionField: string;
    /**
     * String-indexed registry of available contextual form actions invoked upon submitting.
     * Each action has the same signature as the `onSubmit` submission handler.
     */
    formActions: FormActions<FormSubmitAction>;
    children?: ReactNode;
}


const FormikInnerForm = (props: FormikOuterProps & FormikProps<Values>) => {
    const {
        values,
        formActions,
        formActionField,
        isSubmitting,
        submitForm,
        setFieldValue,
        children,
    } = props;

    React.useEffect(() => {
        submitForm();
    }, [values?.contextualSubmitAction, submitForm]);

    return (
        <>
            {children}
            <div>
                {Object
                    .entries(formActions)
                    .filter(([action]) => action !== 'noop')
                    .map(([action, f]) =>
                        <Button
                            key={action}
                            style={{ textTransform: 'capitalize' }}
                            disabled={isSubmitting}
                            onClick={() => setFieldValue(formActionField, f)}>
                            {action}
                        </Button>
                    )}
            </div>

        </>
    );
};


/**
 * Base component for building record deposition forms
 * 
 * @param props 
 * @returns 
 */
export const OARepoDepositForm = (props: OARepoDepositFormProps) => {
    const {
        onSubmit,
        initialValues,
        formActions,
        children,
        ...formikProps
    } = props;

    const defaultFormActions = {
        submit: (value: Values, formikBag: FormikHelpers<Values>) => onSubmit(value, formikBag),
    } as FormActions<FormSubmitAction>;

    const contextualActions = formActions ?? defaultFormActions
    contextualActions['noop'] = () => undefined

    const contextualActionField = "contextualSubmitAction"

    const onContextualSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
        const { setFieldValue, setSubmitting } = formikBag
        const { contextualSubmitAction: action, ...formValues } = values
        action.name && console.debug('[OARepoDepositForm] submitting action:', action.name, 'with:', formValues)
        values.contextualSubmitAction(values, formikBag)

        setFieldValue(contextualActionField, contextualActions.noop)
        setSubmitting(false)
    }

    return (
        <>
            <Formik initialValues={{
                contextualSubmitAction: contextualActions.noop, ...initialValues,
            }} {...formikProps} onSubmit={onContextualSubmit}>
                {(formikInnerProps: FormikProps<Values>) => {
                    return (
                        <>
                            <FormikInnerForm
                                formActions={contextualActions}
                                formActionField={contextualActionField}
                                {...formikInnerProps}>
                                {children}
                            </FormikInnerForm>
                            {formikInnerProps.status && (
                                <div>
                                    <Label color="green">{formikInnerProps.status}</Label>
                                </div>
                            )}
                        </>
                    );
                }}
            </Formik >
        </>
    );
};
