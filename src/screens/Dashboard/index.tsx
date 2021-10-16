import React from 'react';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import {
  Container,
  Header,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  UserWrapper,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

export function Dashboard() {

  const data: DataListProps[] = [{
    id: '1',
    type: 'positive',
    title: "Desenvolvimento de sistemas",
    amount: "'00000",
    category: {
      name: "vendas",
      icon: "dollar-sign"
    },
    date: "dd/dd/dddd"
  },
  {
    id: '2',
    type: 'negative',
    title: "gasto de sistemas",
    amount: "'00000",
    category: {
      name: "Alimentação",
      icon: "coffee"
    },
    date: "dd/dd/dddd"
  }
    ,
  {
    id: '3',
    type: 'negative',
    title: "gastp de sistemas",
    amount: "'00000",
    category: {
      name: "casa",
      icon: "shopping-bag"
    },
    date: "dd/dd/dddd"
  }

  ];

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo source={{ uri: "https://github.com/moacyr.png" }} />
            <User>
              <UserGreeting>Olá,</UserGreeting>
              <UserName>Moacyr</UserName>
            </User>
          </UserInfo>
          <Icon name="power" />
        </UserWrapper>
      </Header>

      <HighlightCards>
        <HighlightCard
          type='up'
          title="Entradas"
          ammount="R$ 17.400,00"
          lastTransaction="Última entrada dia 13 de abril"
        />
        <HighlightCard
          type='down'
          title="Saídas"
          ammount="R$ 1.259,00"
          lastTransaction="Última saída dia 03 de abril"
        />
        <HighlightCard
          type='total'
          title="Total"
          ammount="R$ 16.141,00"
          lastTransaction="01 à 16 de abril"
        />
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>
        <TransactionList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />

      </Transactions>

    </Container>
  )
}
