import React from 'react'
import {makeStyles} from "@material-ui/core/styles";
// import {Field} from "redux-form";
import TextField from '@material-ui/core/TextField';
// import InputAdornment from '@material-ui/core/InputAdornment';
// import SentimentSatisfiedRoundedIcon from '@material-ui/icons/SentimentSatisfiedRounded';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2),
    marginBottom: 0
  },
  field: {
    width: '100%'
  },
  //font: props => props.font
  resize: {
    fontSize: props => props.fontSize || '1em'
  }
}))

export const TextArea = (
  {input, label, meta: {touched, error}, fontSize, endAdornment, ...restProps}
) => {
  let classes = useStyles({fontSize: fontSize})
  
  // touched нужен только для полей, которые обязательны для заполнения, для TextArea 
  return (
    <TextField   
      error={Boolean(error)}  // принимает булевое значение, если оно true, то поле будет выделено красным(по умолчанию)
      helperText={error} // Сюда можно всунуть текст ошибки
      multiline
      InputProps={{ // Это фишка material ui, только так в TextField можно изменить размер текста, шрифт и т.д.. 
        classes: {
          input: classes.resize,
        },
        style: {
          padding: 6,
          //color: "red"
        },
        endAdornment: endAdornment
      }}
      {...input} // содержит name, коллбеки и value(введённый текст).
      {...restProps}
      
    />
  )
}

export const OutlinedTextInput = (
  props
) => {

  let {input, meta: {touched, error}, ...restProps} = props
  let hasError = touched && error

  //console.log(props)

  return (
    <TextField
      error={Boolean(hasError)}
      helperText={hasError && error}
      //variant='outlined'
      {...input}
      {...restProps}
    />
  )
}

export const DateInput = (
  {input, meta: {touched, error}, ...restProps}
) => {
  let hasError = touched && error

  //console.log(restProps)

  return (
    <TextField
      error={Boolean(hasError)}
      label="Birthday"
      type="date"
      helperText={hasError && error}
      {...input}
      {...restProps}
    />
  )
}

//export const createField = (restProps, component, validate, text) => {
//    return (<div>
//        <Field
//            component={component}
//            {...restProps}
//            validate={validate}
//        /> {text}
//    </div>
//    )
//}

