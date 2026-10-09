import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';

// GAA scoring: a goal is worth 3 points, a point is worth 1,
// and a 2-pointer (football arc score) adds 2 to the points column.
const emptyScore = { goals: 0, points: 0 };
const total = (s) => s.goals * 3 + s.points;
const format = (s) => `${s.goals}-${String(s.points).padStart(2, '0')}`;

function Btn({ label, onPress, style, disabled }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.btn, style, disabled && styles.disabled]}
    >
      <Text style={styles.btnText}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function App() {
  const [names, setNames] = useState({ a: 'Team A', b: 'Team B' });
  const [scores, setScores] = useState({ a: emptyScore, b: emptyScore });
  const [history, setHistory] = useState([]); // for undo

  const addScore = (team, type, amount = 1) => {
    setHistory((h) => [...h, scores]);
    setScores((s) => ({
      ...s,
      [team]: { ...s[team], [type]: s[team][type] + amount },
    }));
  };

  const undo = () => {
    if (history.length === 0) return;
    setScores(history[history.length - 1]);
    setHistory((h) => h.slice(0, -1));
  };

  const reset = () => {
    Alert.alert('Reset match?', 'This will set both scores back to 0-00.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          setScores({ a: emptyScore, b: emptyScore });
          setHistory([]);
        },
      },
    ]);
  };

  const renderTeam = (team) => (
    <View style={styles.card}>
      <TextInput
        style={styles.name}
        value={names[team]}
        onChangeText={(t) => setNames({ ...names, [team]: t })}
        maxLength={20}
      />
      <Text style={styles.score}>{format(scores[team])}</Text>
      <Text style={styles.total}>Total: {total(scores[team])}</Text>
      <View style={styles.row}>
        <Btn label="+ Goal" style={styles.goalBtn} onPress={() => addScore(team, 'goals')} />
        <Btn label="+ Point" style={styles.pointBtn} onPress={() => addScore(team, 'points')} />
        <Btn label="+ 2 Pt" style={styles.twoBtn} onPress={() => addScore(team, 'points', 2)} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>GAA Score Tracker</Text>

      {renderTeam('a')}
      {renderTeam('b')}

      <View style={styles.row}>
        <Btn label="Undo" style={styles.undoBtn} onPress={undo} disabled={history.length === 0} />
        <Btn label="Reset" style={styles.resetBtn} onPress={reset} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b3d2e', padding: 16, paddingTop: 48 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 16 },
  card: { backgroundColor: '#14573f', borderRadius: 16, padding: 16, marginBottom: 16, alignItems: 'center' },
  name: { color: '#fff', fontSize: 20, fontWeight: '600', textAlign: 'center', minWidth: 160 },
  score: { color: '#ffd54f', fontSize: 64, fontWeight: '800', marginVertical: 4 },
  total: { color: '#cde8dc', fontSize: 16, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
  btn: { paddingVertical: 14, paddingHorizontal: 14, borderRadius: 12, minWidth: 88, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  goalBtn: { backgroundColor: '#2e7d32' },
  pointBtn: { backgroundColor: '#1565c0' },
  twoBtn: { backgroundColor: '#6a1b9a' },
  undoBtn: { backgroundColor: '#f9a825' },
  resetBtn: { backgroundColor: '#c62828' },
  disabled: { opacity: 0.4 },
});
