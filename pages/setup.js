import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { UserContext } from "./_app";

export default function Setup() {
  const [name, setName] = useState("");
  const [exercises, setExercises] = useState([]);
  const [exerciseName, setExerciseName] = useState("");
  const [reps, setReps] = useState("");
  const [sets, setSets] = useState("");
  const [description, setDescription] = useState("");
  const [restTime, setRestTime] = useState("");
  const [rpe, setRpe] = useState("");
  const [tempo, setTempo] = useState("");
  const router = useRouter();
  const { user } = useContext(UserContext);

  const addExercise = () => {
    if (exerciseName && reps && sets) {
      setExercises([
        ...exercises,
        { name: exerciseName, reps, sets, description, restTime, rpe, tempo },
      ]);
      setExerciseName("");
      setReps("");
      setSets("");
      setDescription("");
      setRestTime("");
      setRpe("");
      setTempo("");
    }
  };

  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const saveWorkout = async () => {
    if (name && exercises.length > 0 && user) {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, exercises, userId: user.id }),
      });
      if (res.ok) {
        router.push("/");
      }
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ margin: "0 0 8px 0" }}>Create Workout</h1>
        <p
          style={{
            color: "#64748b",
            margin: 0,
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          Setup your exercise routine
        </p>
      </div>

      {/* Workout Name */}
      <div style={{ marginBottom: "24px" }}>
        <label
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#334155",
            display: "block",
            marginBottom: "8px",
          }}
        >
          Workout Name
        </label>
        <input
          type="text"
          placeholder="e.g., Chest & Triceps"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 14px",
            border: `2px solid ${name ? "#3b82f6" : "#e2e8f0"}`,
            borderRadius: "10px",
            fontSize: "16px",
            transition: "all 0.3s ease",
          }}
        />
      </div>

      {/* Add Exercises Section */}
      <div
        style={{
          padding: "16px",
          backgroundColor: "#f0f9ff",
          border: "2px dashed #bfdbfe",
          borderRadius: "12px",
          marginBottom: "24px",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "#1e40af",
            margin: "0 0 16px 0",
          }}
        >
          + Add Exercises
        </h2>

        <label
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "#334155",
            display: "block",
            marginBottom: "6px",
          }}
        >
          Exercise Name *
        </label>
        <input
          type="text"
          placeholder="e.g., Barbell Bench Press"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
          style={{ marginBottom: "14px" }}
        />

        <div style={{ display: "flex", gap: "10px", marginBottom: "14px" }}>
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#334155",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Sets *
            </label>
            <input
              type="text"
              placeholder="4 / 3-4 / 5x5"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#334155",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Reps *
            </label>
            <input
              type="text"
              placeholder="8 / 8-10 / 6-12"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
            />
          </div>
        </div>

        <label
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "#334155",
            display: "block",
            marginBottom: "6px",
          }}
        >
          Description
        </label>
        <textarea
          placeholder="Add any notes about form, tempo, etc."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="2"
          style={{ marginBottom: "14px", resize: "none" }}
        />

        <label
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "#334155",
            display: "block",
            marginBottom: "6px",
          }}
        >
          Rest Time
        </label>
        <input
          type="text"
          placeholder="60s / 60-90s / 2-3 min"
          value={restTime}
          onChange={(e) => setRestTime(e.target.value)}
          style={{ marginBottom: "14px" }}
        />

        <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#334155",
                display: "block",
                marginBottom: "6px",
              }}
            >
              RPE
            </label>
            <input
              type="text"
              placeholder="7 / 8-9 / Max"
              value={rpe}
              onChange={(e) => setRpe(e.target.value)}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#334155",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Tempo
            </label>
            <input
              type="text"
              placeholder="3-1-2-0"
              value={tempo}
              onChange={(e) => setTempo(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={addExercise}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: 700,
            fontSize: "14px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 6px 16px rgba(59, 130, 246, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 4px 12px rgba(59, 130, 246, 0.3)";
          }}
        >
          ＋ Add Exercise
        </button>
      </div>

      {/* Exercises List */}
      {exercises.length > 0 && (
        <>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#1e293b",
              margin: "0 0 16px 0",
            }}
          >
            Exercises Added ({exercises.length})
          </h2>
          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              listStyle: "none",
              padding: 0,
              marginBottom: "24px",
            }}
          >
            {exercises.map((ex, index) => (
              <li
                key={index}
                style={{
                  padding: "16px",
                  backgroundColor: "#f8fafc",
                  border: "2px solid #e2e8f0",
                  borderRadius: "10px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "12px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#1e293b",
                        marginBottom: "6px",
                      }}
                    >
                      {ex.name}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        color: "#64748b",
                        fontWeight: 600,
                        marginBottom: "8px",
                      }}
                    >
                      {ex.sets} sets × {ex.reps} reps
                    </p>
                    {ex.description && (
                      <p
                        style={{
                          margin: "6px 0",
                          fontSize: "13px",
                          color: "#64748b",
                        }}
                      >
                        📝 {ex.description}
                      </p>
                    )}
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        marginTop: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      {ex.restTime && (
                        <span
                          style={{
                            fontSize: "12px",
                            backgroundColor: "#dbeafe",
                            color: "#1e40af",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            fontWeight: 600,
                          }}
                        >
                          ⏱️ {ex.restTime}s
                        </span>
                      )}
                      {ex.rpe && (
                        <span
                          style={{
                            fontSize: "12px",
                            backgroundColor: "#dbeafe",
                            color: "#1e40af",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            fontWeight: 600,
                          }}
                        >
                          📊 RPE: {ex.rpe}
                        </span>
                      )}
                      {ex.tempo && (
                        <span
                          style={{
                            fontSize: "12px",
                            backgroundColor: "#dbeafe",
                            color: "#1e40af",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            fontWeight: 600,
                          }}
                        >
                          ⚡ {ex.tempo}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeExercise(index)}
                    style={{
                      backgroundColor: "#fee2e2",
                      color: "#dc2626",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "18px",
                      fontWeight: 700,
                      transition: "all 0.2s ease",
                      minWidth: "40px",
                      minHeight: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#fecaca";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#fee2e2";
                    }}
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Save Button */}
      <button
        onClick={saveWorkout}
        disabled={!name || exercises.length === 0}
        style={{
          width: "100%",
          padding: "14px",
          fontSize: "16px",
          fontWeight: 700,
          background:
            name && exercises.length > 0
              ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
              : "#cbd5e1",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: name && exercises.length > 0 ? "pointer" : "not-allowed",
          transition: "all 0.3s ease",
          boxShadow:
            name && exercises.length > 0
              ? "0 4px 16px rgba(16, 185, 129, 0.4)"
              : "none",
        }}
        onMouseEnter={(e) => {
          if (name && exercises.length > 0) {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow =
              "0 8px 24px rgba(16, 185, 129, 0.5)";
          }
        }}
        onMouseLeave={(e) => {
          if (name && exercises.length > 0) {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 4px 16px rgba(16, 185, 129, 0.4)";
          }
        }}
      >
        ✓ Save Workout
      </button>
    </div>
  );
}
