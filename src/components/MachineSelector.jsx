const MACHINES = ["Treadmill", "Rowing Machine", "Leg Press", "Cable Station"];

function MachineSelector({ machines = MACHINES, selectedMachine, onSelect }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
      {machines.map((machine) => {
        const active = machine === selectedMachine;
        return (
          <button
            key={machine}
            type="button"
            onClick={() => onSelect?.(machine)}
            style={{
              minHeight: 40,
              borderRadius: 12,
              border: `1px solid ${active ? "#ff6f50" : "rgba(255,255,255,0.12)"}`,
              background: active ? "rgba(255,111,80,0.14)" : "#222",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {machine}
          </button>
        );
      })}
    </div>
  );
}

export default MachineSelector;
