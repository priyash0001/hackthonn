from typing import List
from ..models.schemas import BenchmarkItem, SubjectArea

BENCHMARK_DATASET: List[BenchmarkItem] = [
    BenchmarkItem(
        id="calc-01",
        title="Calculus: Chain Rule Differentiation",
        subject=SubjectArea.MATH,
        problem_statement="Find the derivative with respect to x of: f(x) = (3x^2 + 5)^4",
        student_work="f(x) = (3x^2 + 5)^4\nStep 1: Use the power rule on the outside: 4 * (3x^2 + 5)^3\nStep 2: f'(x) = 4(3x^2 + 5)^3",
        actual_mistake="Forgot to multiply by the derivative of the inner function (chain rule inner derivative d/dx(3x^2 + 5) = 6x).",
        ground_truth_answer="24x(3x^2 + 5)^3",
        tier_expectations={
            1: "What is the general Chain Rule formula when differentiating a composite function f(g(x))?",
            2: "When you applied the power rule to the outer function, what happened to the rate of change of the inside function (3x^2 + 5)?",
            3: "If u = 3x^2 + 5, what is du/dx, and how must dy/du and du/dx be combined?",
            4: "Look closely at Step 2: What is the derivative of the inner expression 3x^2 + 5, and how should it multiply your current result?"
        }
    ),
    BenchmarkItem(
        id="phys-02",
        title="Physics: Normal Force on an Inclined Plane",
        subject=SubjectArea.PHYSICS,
        problem_statement="A block of mass m rests on a frictionless ramp inclined at angle theta. Find the normal force N exerted by the ramp on the block.",
        student_work="Free Body Diagram:\n- Gravity pulls down: Fg = mg\n- Ramp pushes perpendicular: N\nEquation:\nSum of vertical forces = 0 => N - mg = 0 => N = mg",
        actual_mistake="Equated normal force directly to mg instead of resolving gravity into perpendicular and parallel components (N = mg * cos(theta)).",
        ground_truth_answer="mg*cos(theta)",
        tier_expectations={
            1: "Which coordinate axes are most aligned with the surfaces: standard horizontal/vertical, or tilted parallel/perpendicular to the ramp?",
            2: "How does the full gravitational force mg break down into components perpendicular and parallel to the inclined ramp?",
            3: "If the ramp angle theta approaches 90 degrees (a vertical wall), what should the normal force physically become?",
            4: "In your force balance perpendicular to the ramp, why did mg not have a cosine or sine factor attached to it?"
        }
    ),
    BenchmarkItem(
        id="circ-03",
        title="Circuits: Kirchhoff's Voltage Law (KVL) Sign Convention",
        subject=SubjectArea.CIRCUITS,
        problem_statement="A single loop circuit has a 12V battery and two resistors R1 = 4 ohms and R2 = 2 ohms in series. Write the KVL loop equation clockwise to find loop current I.",
        student_work="Tracing clockwise starting before 12V source:\n+12V (entering negative, leaving positive)\n+ I*R1 + I*R2 = 0\n12 + 4I + 2I = 0\n6I = -12 => I = -2A",
        actual_mistake="Sign error in KVL: voltage drops across passive resistors should have the opposite sign of the battery voltage rise.",
        ground_truth_answer="I = 2A",
        tier_expectations={
            1: "What sign convention are you using when tracing across an active voltage source vs passive resistors in the direction of current?",
            2: "As current passes through a resistor in the loop direction, does the electric potential increase or drop?",
            3: "If the 12V source adds electrical energy (+12V), should the resistor terms have the same sign or the opposite sign?",
            4: "What happens to your loop equation if you write the voltage across each resistor as a voltage drop (-I*R)?"
        }
    ),
    BenchmarkItem(
        id="geom-04",
        title="Geometry Proof: Triangle Congruence Criteria",
        subject=SubjectArea.PROOFS,
        problem_statement="Given two triangles ABC and DEF where angle A = angle D, angle B = angle E, and angle C = angle F. Prove whether triangle ABC is congruent to triangle DEF.",
        student_work="Proof:\n1. Angle A = Angle D (Given)\n2. Angle B = Angle E (Given)\n3. Angle C = Angle F (Given)\nConclusion: Triangle ABC is congruent to Triangle DEF by AAA congruence theorem.",
        actual_mistake="AAA (Angle-Angle-Angle) proves similarity, not congruence. Sides could be scaled by an arbitrary factor.",
        ground_truth_answer="Triangles are similar, not congruent",
        tier_expectations={
            1: "What is the fundamental difference between geometric 'congruence' and geometric 'similarity'?",
            2: "Can two triangles share identical angles (like two equilateral triangles) but have different side lengths?",
            3: "Which congruence theorems require at least one side length to be known (e.g., SSS, SAS, ASA)?",
            4: "Does having identical angles guarantee that the size/scale factor between the triangles is exactly 1?"
        }
    ),
    BenchmarkItem(
        id="alg-05",
        title="Algebra: Distributing Negative Signs Across Parentheses",
        subject=SubjectArea.MATH,
        problem_statement="Simplify the algebraic expression: 5x - (3x - 8)",
        student_work="Step 1: 5x - (3x - 8)\nStep 2: Distribute minus sign: 5x - 3x - 8\nStep 3: Combine like terms: 2x - 8",
        actual_mistake="Failed to distribute the negative sign to the constant term -8 (resulting in -(-8) = +8).",
        ground_truth_answer="2x + 8",
        tier_expectations={
            1: "When you distribute a negative sign across brackets, how does it affect every term inside, particularly negative terms?",
            2: "What is the result of multiplying (-1) by (-8)?",
            3: "If you test with x = 10, does 5(10) - (3(10) - 8) give the same number as 2(10) - 8?",
            4: "In Step 2, what should the sign of the constant term be after computing -1 * (-8)?"
        }
    )
]
