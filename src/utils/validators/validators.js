export const required = value => {
    if(value) return undefined

    return 'Field is required'
}

export const maxLengthCreator = (maxLength) => {
    return (value, ...rest) => {
        //console.log(rest)
        if(value && value.length > maxLength) return `Max length is ${maxLength} symbols`

        return undefined
    }
}

export const minLengthCreator = (minLength) => {
    return (value, ...rest) => {
        //console.log(rest)
        if(value && value.length < minLength) {
            return `Min length is ${minLength} symbols`
        }
        return undefined
    }
}

//export const status(values) {
//  const errors = {};
//  const requiredFields = [
//    'firstName',
//    'lastName',
//    'email',
//    'favoriteColor',
//    'notes',
//  ];
//  requiredFields.forEach(field => {
//    if (!values[field]) {
//      errors[field] = 'Required';
//    }
//  });
//  if (
//    values.email &&
//    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
//  ) {
//    errors.email = 'Invalid email address';
//  }
//  return errors;
//}
//
