import React from "react";
import {
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  View,
  Text,
} from "react-native";

export default function App() {
  const [searchVal, setSearchVal] = React.useState("");
  const [searchedList, setSearchedList] = React.useState([]);

  //debouncing logic
  React.useEffect(() => {
    let timeout;
    if (searchVal) {
      timeout = setTimeout(() => {
        fetchList();
      }, 500);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [fetchList, searchVal]);

  const fetchList = React.useCallback(() => {
    const fetchbaseUrl =
      "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    const url = `${fetchbaseUrl}${searchVal}`;
    fetch(url).then(async (res) => {
      const responseData = await res.json();
      const mealsList = responseData?.meals;
      setSearchedList(mealsList);
    });
  }, [searchVal]);

  const onChangeTextInput = (value) => {
    setSearchVal(value);
    setSearchedList([]);
  };

  //switch to expanded view
  const onPressTextExpansion = (selected) => {
    const copyData = [...searchedList];
    const tappedItemIndex = copyData.findIndex(
      (item) => item.idMeal === selected?.idMeal
    );
    const tappedItem = copyData[tappedItemIndex];
    if (!tappedItem.hasOwnProperty("numberOfLines")) {
      tappedItem.numberOfLines = 0;
      tappedItem.expansionText = "See less";
    } else {
      delete tappedItem.expansionText;
      delete tappedItem.numberOfLines;
    }
    copyData[tappedItemIndex] = tappedItem;
    setSearchedList(copyData);
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.listContainer}>
        <Image source={{ uri: item.strMealThumb }} style={styles.image} />
        <View style={{ flex: 1 }}>
          <Text style={styles.itemHeader}>{item.strMeal}</Text>
          <Text
            style={styles.itemDescription}
            numberOfLines={item?.numberOfLines ?? 2}
          >
            {item.strInstructions}
          </Text>
          <Text
            style={styles.expansiontext}
            onPress={() => {
              onPressTextExpansion(item);
            }}
          >
            {item.expansionText ?? "See more"}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.textInputView}>
        <TextInput
          value={searchVal}
          onChangeText={(val) => onChangeTextInput(val)}
          placeholder="Search for you meal..."
          placeholderTextColor="grey"
          onFocus={() => {
            setIsTextInputFocused(true);
          }}
          style={styles.textInput}
        />
        <TouchableOpacity
          onPress={() => {
            setSearchVal("");
            setSearchedList([]);
          }}
          style={styles.closeButtonView}
        >
          <Text style={styles.closeIcon}>{"X"}</Text>
        </TouchableOpacity>
      </View>
      {searchedList?.length > 0 ? (
        <FlatList
          data={searchedList}
          renderItem={(item) => renderItem(item)}
          style={styles.MT_20}
        />
      ) : searchVal ? (
        <View style={styles.noRecordsView}>
          <Text style={styles.noRecordsFound}>{"No results founds"}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
    padding: 12,
  },
  textInputView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 40,
    width: "100%",
  },
  listContainer: {
    flexDirection: "row",
    gap: 12,
    marginVertical: 12,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  itemHeader: { fontSize: 14, fontWeight: "700" },
  itemDescription: { fontSize: 12 },
  noRecordsFound: { fontWeight: "700", fontSize: 18, alignSelf: "center" },
  closeIcon: { color: "grey", fontSize: 14 },
  expansiontext: {
    fontSize: 12,
    color: "blue",
    textDecorationLine: "underline",
  },
  closeButtonView: {
    minHeight: 40,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "black",
    padding: 10,
  },
  MT_20: { marginTop: 20 },
  noRecordsView: { flex: 1, justifyContent: "center" },
  image: {
    height: 50,
    width: 50,
    alignSelf: "flex-start",
    marginTop: 4,
    borderRadius: 6,
  },
});
