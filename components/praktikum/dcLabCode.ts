export const DIVIDER_ARDUINO = String.raw`// Делител на напрежение: D8 -> R1 -> Vout -> R2 -> GND
const byte SOURCE_PIN = 8;
const byte VIN_PIN = A1;
const byte VOUT_PIN = A0;

// Измерете 5 V шината с мултицет и коригирайте тази стойност при нужда.
const float VREF = 5.00;

float readVoltage(byte pin) {
  analogRead(pin);                 // Отхвърляме първото четене след смяна на канала.
  unsigned long sum = 0;
  for (byte i = 0; i < 32; i++) {
    sum += analogRead(pin);
    delayMicroseconds(250);
  }
  return (sum / 32.0) * VREF / 1023.0;
}

void setup() {
  pinMode(SOURCE_PIN, OUTPUT);
  digitalWrite(SOURCE_PIN, LOW);
  Serial.begin(115200);
  delay(500);
  digitalWrite(SOURCE_PIN, HIGH);   // Създава входното постоянно напрежение.
  Serial.println("time_ms,Vin_V,Vout_V,ratio");
}

void loop() {
  const float vin = readVoltage(VIN_PIN);
  const float vout = readVoltage(VOUT_PIN);

  Serial.print(millis());
  Serial.print(',');
  Serial.print(vin, 4);
  Serial.print(',');
  Serial.print(vout, 4);
  Serial.print(',');
  Serial.println(vin > 0.05 ? vout / vin : 0.0, 5);
  delay(100);
}`;

export const DIVIDER_PYTHON = String.raw`# pip install pyserial matplotlib
import time
import serial
import matplotlib.pyplot as plt

PORT = "COM3"       # Сменете с порта на Вашето Arduino.
BAUD = 115200
DURATION_S = 15
THEORY_RATIO = 10_000 / (4_700 + 10_000)

t_ms, vin, vout = [], [], []

with serial.Serial(PORT, BAUD, timeout=1) as ser:
    time.sleep(2)     # Arduino Uno се рестартира при отваряне на порта.
    ser.reset_input_buffer()
    start = time.time()

    while time.time() - start < DURATION_S:
        line = ser.readline().decode("utf-8", errors="ignore").strip()
        if not line or line.startswith("time_ms"):
            continue
        try:
            t, vi, vo, ratio = map(float, line.split(","))
        except ValueError:
            continue
        t_ms.append(t)
        vin.append(vi)
        vout.append(vo)

theory = [value * THEORY_RATIO for value in vin]
plt.plot([t / 1000 for t in t_ms], vout, label="измерено Vout")
plt.plot([t / 1000 for t in t_ms], theory, "--", label="Vin·R2/(R1+R2)")
plt.xlabel("време, s")
plt.ylabel("напрежение, V")
plt.grid(True)
plt.legend()
plt.tight_layout()
plt.show()`;

export const KVL_ARDUINO = String.raw`// Закон на Кирхоф: D8 -> R1 -> R2 -> R3 -> GND
const byte SOURCE_PIN = 8;
const byte V0_PIN = A0;
const byte V1_PIN = A1;
const byte V2_PIN = A2;
const float VREF = 5.00;

float readVoltage(byte pin) {
  analogRead(pin);
  unsigned long sum = 0;
  for (byte i = 0; i < 32; i++) {
    sum += analogRead(pin);
    delayMicroseconds(250);
  }
  return (sum / 32.0) * VREF / 1023.0;
}

void setup() {
  pinMode(SOURCE_PIN, OUTPUT);
  digitalWrite(SOURCE_PIN, HIGH);
  Serial.begin(115200);
  Serial.println("time_ms,V0_V,V1_V,V2_V,dV_R1_V,dV_R2_V,dV_R3_V,sum_V,error_V");
}

void loop() {
  const float v0 = readVoltage(V0_PIN);
  const float v1 = readVoltage(V1_PIN);
  const float v2 = readVoltage(V2_PIN);
  const float dV1 = v0 - v1;
  const float dV2 = v1 - v2;
  const float dV3 = v2;
  const float sum = dV1 + dV2 + dV3;

  Serial.print(millis());
  Serial.print(','); Serial.print(v0, 4);
  Serial.print(','); Serial.print(v1, 4);
  Serial.print(','); Serial.print(v2, 4);
  Serial.print(','); Serial.print(dV1, 4);
  Serial.print(','); Serial.print(dV2, 4);
  Serial.print(','); Serial.print(dV3, 4);
  Serial.print(','); Serial.print(sum, 4);
  Serial.print(','); Serial.println(sum - v0, 5);
  delay(150);
}`;

export const KVL_PYTHON = String.raw`# pip install pyserial matplotlib
import time
import serial
import matplotlib.pyplot as plt

PORT = "COM3"
BAUD = 115200
DURATION_S = 12

times, source, sums, errors = [], [], [], []

with serial.Serial(PORT, BAUD, timeout=1) as ser:
    time.sleep(2)
    ser.reset_input_buffer()
    start = time.time()
    while time.time() - start < DURATION_S:
        line = ser.readline().decode("utf-8", errors="ignore").strip()
        if not line or line.startswith("time_ms"):
            continue
        try:
            row = list(map(float, line.split(",")))
        except ValueError:
            continue
        if len(row) != 9:
            continue
        t, v0, v1, v2, dv1, dv2, dv3, total, error = row
        times.append(t / 1000)
        source.append(v0)
        sums.append(total)
        errors.append(error * 1000)  # mV

fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True)
ax1.plot(times, source, label="V0")
ax1.plot(times, sums, "--", label="ΔV1+ΔV2+ΔV3")
ax1.set_ylabel("напрежение, V")
ax1.grid(True); ax1.legend()
ax2.plot(times, errors)
ax2.axhline(0, color="black", linewidth=1)
ax2.set_xlabel("време, s")
ax2.set_ylabel("KVL грешка, mV")
ax2.grid(True)
plt.tight_layout()
plt.show()`;

export const RC_ARDUINO = String.raw`// RC преходен процес: D8 -> 10 kΩ -> Vc, 100 µF от Vc към GND
const byte SOURCE_PIN = 8;
const byte VS_PIN = A1;
const byte VC_PIN = A0;
const float VREF = 5.00;
const unsigned long PHASE_MS = 5000;
const unsigned long SAMPLE_MS = 20;

float readVoltage(byte pin) {
  analogRead(pin);
  unsigned long sum = 0;
  for (byte i = 0; i < 16; i++) sum += analogRead(pin);
  return (sum / 16.0) * VREF / 1023.0;
}

void recordPhase(const __FlashStringHelper* name, byte level) {
  digitalWrite(SOURCE_PIN, level);
  const unsigned long start = millis();
  unsigned long nextSample = start;

  while (millis() - start <= PHASE_MS) {
    if ((long)(millis() - nextSample) >= 0) {
      const unsigned long phaseTime = millis() - start;
      const float vs = readVoltage(VS_PIN);
      const float vc = readVoltage(VC_PIN);
      Serial.print(name);
      Serial.print(','); Serial.print(phaseTime);
      Serial.print(','); Serial.print(vs, 4);
      Serial.print(','); Serial.println(vc, 4);
      nextSample += SAMPLE_MS;
    }
  }
}

void setup() {
  pinMode(SOURCE_PIN, OUTPUT);
  digitalWrite(SOURCE_PIN, LOW);
  Serial.begin(115200);
  Serial.println("phase,t_ms,Vs_V,Vc_V");
  delay(1000);                         // Начално разреждане.
  recordPhase(F("charge"), HIGH);
  recordPhase(F("discharge"), LOW);
  Serial.println("END");
}

void loop() {
  // Един цикъл е достатъчен. Натиснете Reset за ново измерване.
}`;

export const RC_PYTHON = String.raw`# pip install pyserial matplotlib
import time
import math
import serial
import matplotlib.pyplot as plt

PORT = "COM3"
BAUD = 115200
TAU_S = 10_000 * 100e-6   # R·C = 1,0 s

data = {"charge": ([], []), "discharge": ([], [])}

with serial.Serial(PORT, BAUD, timeout=2) as ser:
    time.sleep(2)
    while True:
        line = ser.readline().decode("utf-8", errors="ignore").strip()
        if line == "END":
            break
        if not line or line.startswith("phase"):
            continue
        try:
            phase, t_ms, vs, vc = line.split(",")
            t = float(t_ms) / 1000
            voltage = float(vc)
        except (ValueError, KeyError):
            continue
        data[phase][0].append(t)
        data[phase][1].append(voltage)

tc, vc = data["charge"]
td, vd = data["discharge"]
v_final = max(vc) if vc else 5.0
plt.plot(tc, vc, label="зареждане")
plt.plot(td, vd, label="разреждане")
plt.plot(tc, [v_final * (1 - math.exp(-t / TAU_S)) for t in tc], "--", label="теория")
plt.xlabel("време от началото на фазата, s")
plt.ylabel("Vc, V")
plt.grid(True); plt.legend(); plt.tight_layout(); plt.show()`;

export const DIODE_ARDUINO = String.raw`// Филтриран PWM sweep за I-V характеристика на 1N4148.
const byte PWM_PIN = 9;
const byte VS_PIN = A0;       // След Rf и Cf.
const byte VD_PIN = A1;       // Напрежение върху диода.
const float VREF = 5.00;
const float RS_OHMS = 1000.0;

float readVoltage(byte pin) {
  analogRead(pin);
  unsigned long sum = 0;
  for (byte i = 0; i < 64; i++) {
    sum += analogRead(pin);
    delayMicroseconds(200);
  }
  return (sum / 64.0) * VREF / 1023.0;
}

void printPoint(const char* direction, int duty) {
  analogWrite(PWM_PIN, duty);
  delay(250);                 // Повече от 5·Rf·Cf при 1 kΩ и 47 µF.
  const float vs = readVoltage(VS_PIN);
  const float vd = readVoltage(VD_PIN);
  float currentmA = (vs - vd) * 1000.0 / RS_OHMS;
  if (currentmA < 0) currentmA = 0;

  Serial.print(direction);
  Serial.print(','); Serial.print(duty);
  Serial.print(','); Serial.print(vs, 4);
  Serial.print(','); Serial.print(vd, 4);
  Serial.print(','); Serial.println(currentmA, 5);
}

void setup() {
  pinMode(PWM_PIN, OUTPUT);
  analogWrite(PWM_PIN, 0);
  Serial.begin(115200);
  Serial.println("direction,duty,Vs_V,Vd_V,I_mA");
  for (int duty = 0; duty <= 255; duty += 5) printPoint("up", duty);
  for (int duty = 255; duty >= 0; duty -= 5) printPoint("down", duty);
  analogWrite(PWM_PIN, 0);
  Serial.println("END");
}

void loop() {}`;

export const DIODE_PYTHON = String.raw`# pip install pyserial matplotlib
import time
import serial
import matplotlib.pyplot as plt

PORT = "COM3"
BAUD = 115200
points = {"up": ([], []), "down": ([], [])}

with serial.Serial(PORT, BAUD, timeout=2) as ser:
    time.sleep(2)
    while True:
        line = ser.readline().decode("utf-8", errors="ignore").strip()
        if line == "END":
            break
        if not line or line.startswith("direction"):
            continue
        try:
            direction, duty, vs, vd, current = line.split(",")
            points[direction][0].append(float(vd))
            points[direction][1].append(float(current))
        except (ValueError, KeyError):
            continue

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(9, 4))
for direction, (voltage, current) in points.items():
    ax1.plot(voltage, current, ".", label=direction)
    positive = [(v, i) for v, i in zip(voltage, current) if i > 0.005]
    if positive:
        ax2.semilogy([p[0] for p in positive], [p[1] for p in positive], ".", label=direction)
ax1.set_xlabel("Vd, V"); ax1.set_ylabel("I, mA"); ax1.grid(True); ax1.legend()
ax2.set_xlabel("Vd, V"); ax2.set_ylabel("I, mA, лог. скала"); ax2.grid(True); ax2.legend()
plt.tight_layout(); plt.show()`;

export const LED_ARDUINO = String.raw`// I-V характеристика на червен LED с ограничен ток.
const byte PWM_PIN = 9;
const byte VS_PIN = A0;
const byte VLED_PIN = A1;
const float VREF = 5.00;
const float RS_OHMS = 330.0;

float readVoltage(byte pin) {
  analogRead(pin);
  unsigned long sum = 0;
  for (byte i = 0; i < 64; i++) {
    sum += analogRead(pin);
    delayMicroseconds(200);
  }
  return (sum / 64.0) * VREF / 1023.0;
}

void printPoint(int duty) {
  analogWrite(PWM_PIN, duty);
  delay(250);
  const float vs = readVoltage(VS_PIN);
  const float vled = readVoltage(VLED_PIN);
  float currentmA = (vs - vled) * 1000.0 / RS_OHMS;
  if (currentmA < 0) currentmA = 0;

  Serial.print(duty);
  Serial.print(','); Serial.print(vs, 4);
  Serial.print(','); Serial.print(vled, 4);
  Serial.print(','); Serial.println(currentmA, 5);
}

void setup() {
  pinMode(PWM_PIN, OUTPUT);
  analogWrite(PWM_PIN, 0);
  Serial.begin(115200);
  Serial.println("duty,Vs_V,Vled_V,I_mA");
  for (int duty = 0; duty <= 255; duty += 5) printPoint(duty);
  analogWrite(PWM_PIN, 0);
  Serial.println("END");
}

void loop() {}`;

export const LED_PYTHON = String.raw`# pip install pyserial matplotlib
import time
import serial
import matplotlib.pyplot as plt

PORT = "COM3"
BAUD = 115200
voltage, current = [], []

with serial.Serial(PORT, BAUD, timeout=2) as ser:
    time.sleep(2)
    while True:
        line = ser.readline().decode("utf-8", errors="ignore").strip()
        if line == "END":
            break
        if not line or line.startswith("duty"):
            continue
        try:
            duty, vs, vled, current_mA = map(float, line.split(","))
        except ValueError:
            continue
        voltage.append(vled)
        current.append(current_mA)

plt.plot(voltage, current, "o-")
plt.xlabel("напрежение върху LED, V")
plt.ylabel("ток, mA")
plt.title("I-V характеристика на светодиода")
plt.grid(True)
plt.tight_layout()
plt.show()`;

export const LOADING_ARDUINO = String.raw`// Натоварен делител: изпратете стойността на RL през Serial.
const byte VIN_PIN = A1;
const byte VOUT_PIN = A0;
const float VREF = 5.00;

float readVoltage(byte pin) {
  analogRead(pin);
  unsigned long sum = 0;
  for (byte i = 0; i < 64; i++) {
    sum += analogRead(pin);
    delayMicroseconds(200);
  }
  return (sum / 64.0) * VREF / 1023.0;
}

void setup() {
  Serial.begin(115200);
  Serial.setTimeout(200);
  Serial.println("RL_ohm,Vin_V,Vout_V,ratio");
  Serial.println("READY");
}

void loop() {
  if (Serial.available() == 0) return;

  // Python изпраща -1 за отворена верига или стойността на товара в омове.
  const float loadOhms = Serial.parseFloat();
  while (Serial.available()) Serial.read();
  delay(80);

  const float vin = readVoltage(VIN_PIN);
  const float vout = readVoltage(VOUT_PIN);
  Serial.print(loadOhms, 1);
  Serial.print(','); Serial.print(vin, 4);
  Serial.print(','); Serial.print(vout, 4);
  Serial.print(','); Serial.println(vout / vin, 5);
  Serial.println("READY");
}`;

export const LOADING_PYTHON = String.raw`# pip install pyserial matplotlib
import time
import serial
import matplotlib.pyplot as plt

PORT = "COM3"
BAUD = 115200
LOADS = [-1, 100_000, 47_000, 10_000, 4_700, 1_000]
R1 = R2 = 10_000

measured_rl, measured_v, theory_v = [], [], []

with serial.Serial(PORT, BAUD, timeout=2) as ser:
    time.sleep(2)
    ser.reset_input_buffer()

    for rl in LOADS:
        label = "без товар" if rl < 0 else f"RL = {rl:g} Ω"
        input(f"Свържете {label} и натиснете Enter: ")
        ser.write(f"{rl}\n".encode("ascii"))

        while True:
            line = ser.readline().decode("utf-8", errors="ignore").strip()
            if not line or line == "READY" or line.startswith("RL_ohm"):
                continue
            try:
                sent_rl, vin, vout, ratio = map(float, line.split(","))
            except ValueError:
                continue
            break

        effective_rl = 1_000_000 if rl < 0 else rl
        r_bottom = R2 if rl < 0 else (R2 * rl) / (R2 + rl)
        measured_rl.append(effective_rl)
        measured_v.append(vout)
        theory_v.append(vin * r_bottom / (R1 + r_bottom))

plt.semilogx(measured_rl, measured_v, "o-", label="измерено")
plt.semilogx(measured_rl, theory_v, "--", label="теория")
plt.xlabel("товар RL, Ω; 1 MΩ означава без товар")
plt.ylabel("Vout, V")
plt.grid(True); plt.legend(); plt.tight_layout(); plt.show()`;
