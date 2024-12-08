function validate(data, rules) {
  const errors = [];

  for (const [field, rule] of Object.entries(rules)) {
    if (!rule.check(data[field])) {
      errors.push(rule.message);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

module.exports = validate;
