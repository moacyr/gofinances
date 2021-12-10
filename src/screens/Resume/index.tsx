import React, { useEffect, useState, useCallback } from "react";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RFValue } from "react-native-responsive-fontsize";
import { VictoryPie } from "victory-native";
import { addMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useFocusEffect } from "@react-navigation/native";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useTheme } from "styled-components";

import { HistoryCard } from "../../components/HistoryCard";

import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  LoadContainer,
} from "./styles";
import { categories } from "../../utils/categories";

export interface TransactionData {
  type: "positive" | "negative";
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryData {
  key: string;
  name: string;
  totalFormatted: string;
  total: number;
  color: string;
  percent: string;
}

export function Resume() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);
  const theme = useTheme();

  function handleDatechange(action: "next" | "previous") {
    if (action === "next") {
      setSelectedDate(addMonths(selectedDate, 1));
    } else {
      setSelectedDate(addMonths(selectedDate, -1));
    }
  }

  async function loadData() {
    setIsLoading(true);
    const dataKey = "@gofinances:transactions";
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    const expenses = responseFormatted.filter(
      (expense: TransactionData) =>
        expense.type === "negative" &&
        new Date(expense.date).getMonth() === selectedDate.getMonth() &&
        new Date(expense.date).getFullYear() === selectedDate.getFullYear()
    );

    const expenseTotal = expenses.reduce((acumulator: number, expense: TransactionData) => {
      return acumulator + Number(expense.amount);
    }, 0);

    const totalByCategory: CategoryData[] = [];

    categories.forEach((category) => {
      let categorySum = 0;

      expenses.forEach((expense: TransactionData) => {
        if (expense.category === category.key) categorySum += Number(expense.amount);
      });

      if (categorySum > 0) {
        const totalFormatted = categorySum.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        const percent = `${((categorySum / expenseTotal) * 100).toFixed(0)}%`;

        totalByCategory.push({
          key: category.key,
          name: category.name,
          total: categorySum,
          totalFormatted: totalFormatted,
          color: category.color,
          percent: percent,
        });
      }
    });

    setTotalByCategories(totalByCategory);
    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedDate])
  );

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      ) : (
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: useBottomTabBarHeight(),
          }}
        >
          <MonthSelect>
            <MonthSelectButton onPress={() => handleDatechange("previous")}>
              <MonthSelectIcon name="chevron-left" />
            </MonthSelectButton>

            <Month>{format(selectedDate, "MMMM, yyyy", { locale: ptBR })}</Month>

            <MonthSelectButton onPress={() => handleDatechange("next")}>
              <MonthSelectIcon name="chevron-right" />
            </MonthSelectButton>
          </MonthSelect>
          <ChartContainer>
            <VictoryPie
              data={totalByCategories}
              colorScale={totalByCategories.map((category) => category.color)}
              style={{
                labels: {
                  fontSize: RFValue(18),
                  fontWeight: "bold",
                  fill: theme.colors.shape,
                },
              }}
              labelRadius={80}
              x="percent"
              y="total"
            />
          </ChartContainer>
          {totalByCategories.map((item) => (
            <HistoryCard key={item.key} title={item.name} amount={item.totalFormatted} color={item.color} />
          ))}
        </Content>
      )}
    </Container>
  );
}
