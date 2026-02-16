import { memo } from "react";
import { useRestaurantActions, useRestaurantShallowSelector } from "@/store/hooks";
import SettingsView from "@/features/settings/SettingsView";

const SettingsFeatureContent = memo(() => {
  const { selectedCurrencyCode } = useRestaurantShallowSelector((state) => ({
    selectedCurrencyCode: state.currencyCode,
  }));
  const { setCurrencyCode } = useRestaurantActions();

  return (
    <SettingsView selectedCurrencyCode={selectedCurrencyCode} onCurrencyChange={setCurrencyCode} />
  );
});

SettingsFeatureContent.displayName = "SettingsFeatureContent";

export default SettingsFeatureContent;
