export const evaluateFlag = (flag, context) => {
  // 1. Global off
  if (!flag.enabled) {
    return {
      enabled: false,
      value: flag.defaultValue
    };
  }

  // 2. Rules (only equals for now)
  if (Array.isArray(flag.rules)) {
    for (const rule of flag.rules) {
      if (
        rule.operator === "equals" &&
        context[rule.field] === rule.value
      ) {
        return {
          enabled: true,
          value: rule.serveValue
        };
      }
    }
  }

  // 3. Percentage rollout (deterministic)
  if (
    flag.rollout &&
    typeof flag.rollout.percentage === "number" &&
    context.userId
  ) {
    const hash =
      Math.abs(
        [...(context.userId + flag.key)].reduce(
          (a, c) => a + c.charCodeAt(0),
          0
        )
      ) % 100;

    if (hash < flag.rollout.percentage) {
      return {
        enabled: true,
        value: flag.defaultValue
      };
    }
  }

  // 4. Default
  return {
    enabled: false,
    value: flag.defaultValue
  };
};
