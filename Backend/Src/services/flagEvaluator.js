export const evaluateFlag = (flag, context) => {
  // 1. Flag globally disabled
  if (!flag.enabled) {
    return {
      enabled: false,
      value: flag.defaultValue,
      reason: "FLAG_DISABLED"
    };
  }

  // 2. Rule evaluation
  if (Array.isArray(flag.rules)) {
    for (const rule of flag.rules) {
      const ctxValue = context[rule.field];
      let matched = false;

      switch (rule.operator) {
        case "equals":
          matched = ctxValue === rule.value;
          break;

        case "not_equals":
          matched = ctxValue !== rule.value;
          break;

        case "in":
          if (Array.isArray(rule.value)) {
            matched = rule.value.includes(ctxValue);
          }
          break;

        case "contains":
          if (typeof ctxValue === "string" && typeof rule.value === "string") {
            matched = ctxValue.includes(rule.value);
          }
          if (Array.isArray(ctxValue)) {
            matched = ctxValue.includes(rule.value);
          }
          break;

        default:
          matched = false;
      }

      if (matched) {
        return {
          enabled: true,
          value: rule.serveValue,
          reason: "RULE_MATCH"
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
          (sum, ch) => sum + ch.charCodeAt(0),
          0
        )
      ) % 100;

    if (hash < flag.rollout.percentage) {
      return {
        enabled: true,
        value: flag.defaultValue,
        reason: "ROLLOUT_MATCH"
      };
    }
  }

  // 4. Default fallback
  return {
    enabled: false,
    value: flag.defaultValue,
    reason: "DEFAULT_FALLBACK"
  };
};
