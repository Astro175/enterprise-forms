import NextButton from "@/components/NextButton";
import { debounce } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

export type LocationIQResult = {
  place_id: string;
  osm_id: string;
  osm_type: "node" | "way" | "relation";
  licence: string;
  lat: string;
  lon: string;
  boundingbox: [string, string, string, string];

  class: string;
  type: string;

  display_name: string;
  display_place: string;
  display_address: string;

  address: {
    name?: string;
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
};

export type LocationIQResponse = LocationIQResult[];

const Screen = () => {
  const { control, trigger } = useFormContext();
  const [addressValue, setAddressValue] = useState("");
  const [results, setResults] = useState<LocationIQResponse>([]);
  const [error, setError] = useState("");
  const {fromReview} = useLocalSearchParams<{fromReview?: string}>()

  const nextRoute = fromReview === 'true' ? '/review' : '/step2'

  const getSuggestedAddresses = async (query: string) => {
    try {
      const res = await fetch(
        `https://api.locationiq.com/v1/autocomplete?key=pk.4c8244a2a32090845f7e76092bfe3ecc&q=${query}`,
      );
      if (res.status === 401) {
        setError("Configuration error, contact support");
      } else if (res.status === 403 || res.status === 429) {
        setError("Too many requests, please wait");
      } else if (res.status > 500) {
        setError("Service temporarily unavailable");
      } else if (res.status >= 200 && res.status <= 299) {
        const data = await res.json();
        if (data) {
          setResults(data);
        }
      }
    } catch (err) {
      console.log(err);
      setError("Service temporarily unavailable");
    }
  };

  const debouncedFetch = useMemo(
    () => debounce(getSuggestedAddresses, 300),
    [],
  );

  useEffect(() => {
    if (addressValue.length > 2) {
      debouncedFetch(addressValue);
    }
    return () => debouncedFetch.cancel();
  }, [addressValue]);

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.section}>
        <Text style={styles.label}>Address</Text>

        <Controller
          name="address"
          control={control}
          render={({ field: { onChange } }) => (
            <View>
              <View style={styles.inputWrapper}>
                <TextInput
                  value={addressValue}
                  placeholder="Start typing your address"
                  placeholderTextColor="#9CA3AF"
                  onChangeText={(newText) => setAddressValue(newText)}
                  style={styles.input}
                />
              </View>

              {results.length > 0 && (
                <View style={styles.resultsCard}>
                  {results.map((result, index) => (
                    <TouchableOpacity
                      key={result.place_id}
                      style={[
                        styles.resultItem,
                        index !== results.length - 1 && styles.divider,
                      ]}
                      onPress={() => {
                        setAddressValue(result.display_address);
                        onChange(result.display_address);
                        setResults([]);
                      }}
                    >
                      <Text style={styles.placeText}>
                        {result.display_place}
                      </Text>
                      <Text style={styles.addressText}>
                        {result.display_address}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {error && <Text style={{ color: "red" }}>{error}</Text>}
            </View>
          )}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <NextButton
          trigger={trigger}
          fields={["address"]}
          nextRoute={nextRoute}
          lastCompletedStep={2}
        />
      </View>
    </ScrollView>
  );
};

export default Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  section: {
    marginTop: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
  },
  resultsCard: {
    marginTop: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  resultItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  placeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  addressText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
});
