import { NoteTopic, Question, MockTest } from "./types";

export const STATIC_NOTES: NoteTopic[] = [
  {
    id: "math-01",
    title: "Understanding Limits & Continuous Functions",
    subject: "Mathematics",
    preview: "A fundamental guide to the epsilon-delta definition, continuity rules, and indeterminate forms.",
    tags: ["Calculus", "Analysis", "Limits"],
    content: `Continuity at a point is a core concept in single-variable calculus. A function $f(x)$ is continuous at $x = c$ if and only if three conditions are satisfied:
1. $f(c)$ is defined (i.e., $c$ is in the domain of $f$).
2. The limit of $f(x)$ as $x$ approaches $c$ exists.
3. $\\lim_{x \\to c} f(x) = f(c)$.

Indeterminate forms like $0/0$ or $\\infty/\\infty$ can often be evaluated using algebraic manipulation (factoring, rationalization), trigonometric identities, or L'Hôpital's Rule where $\\lim_{x \\to c} \\frac{f(x)}{g(x)} = \\lim_{x \\to c} \\frac{f'(x)}{g'(x)}$ if the limits of $f$ and $g$ are both $0$ or both $\\infty$.

Theorem: Squeeze Theorem (Sandwich Theorem)
If $g(x) \\le f(x) \\le h(x)$ for all $x$ in an open interval containing $c$ (except possibly at $c$) and $\\lim_{x \\to c} g(x) = \\lim_{x \\to c} h(x) = L$, then $\\lim_{x \\to c} f(x) = L$.`
  },
  {
    id: "math-02",
    title: "Matrix Transformations & Vector Spaces",
    subject: "Mathematics",
    preview: "How matrices act as linear operators on space, calculating eigenvalues, eigenvectors, and span.",
    tags: ["Algebra", "Matrices", "Vectors"],
    content: `A linear transformation $T: \\mathbb{R}^n \\to \\mathbb{R}^m$ is a function that preserves vector addition and scalar multiplication:
- $T(u + v) = T(u) + T(v)$
- $T(c \\cdot u) = c \\cdot T(u)$

Every linear transformation can be represented uniquely as a matrix multiplication $T(x) = A \\cdot x$, where $A$ is the standard matrix of the transformation.

Eigenvalue Equation:
For a square matrix $A$, a scalar $\\lambda$ is an eigenvalue if there is a non-zero vector $x$ (eigenvector) such that:
$A \\cdot x = \\lambda \\cdot x \\iff (A - \\lambda I) \\cdot x = 0$

To find the eigenvalues, solve the characteristic equation:
$\\det(A - \\lambda I) = 0$.`
  },
  {
    id: "phys-01",
    title: "Newtonian Mechanics: Force, Friction & Tension",
    subject: "Physics",
    preview: "Comprehensive analysis of free-body diagrams, static vs kinetic friction, and dynamic pulley systems.",
    tags: ["Mechanics", "Forces", "Dynamics"],
    content: `Isaac Newton's laws shape our classical understanding of motion and force:
- 1st Law: An object remains at rest or in uniform motion unless acted upon by a net force.
- 2nd Law: $F_{\\text{net}} = m \\cdot a$. Net force is a vector sum of all external forces.
- 3rd Law: For every action, there is an equal and opposite reaction.

Friction:
- Static friction: $f_s \\le \\mu_s \\cdot F_n$ (where $F_n$ is the normal force). It adjusts to balance external push up to a maximum threshold.
- Kinetic friction: $f_k = \\mu_k \\cdot F_n$. This constant resistive force acts opposite to the direction of relative sliding.
- Generally, $\\mu_s > \\mu_k$ for any given pair of surfaces.`
  },
  {
    id: "phys-02",
    title: "Thermodynamics & Carnot Efficiency",
    subject: "Physics",
    preview: "Energy conservation, the second law, entropy changes, and calculating ideal heat engine cycles.",
    tags: ["Thermal", "Entropy", "Engines"],
    content: `Thermodynamics deals with heat, work, and the transformation of energy:
- 1st Law (Conservation of Energy): $\\Delta U = Q - W$, where $\\Delta U$ is the change in internal energy, $Q$ is heat added, and $W$ is work done by the system.
- 2nd Law (Entropy): Total entropy of an isolated system always increases over time. Heat never spontaneously flows from a colder object to a hotter object.

Carnot Engine Cycle:
This is the most efficient theoretical cycle operating between a hot reservoir ($T_H$) and a cold reservoir ($T_C$):
$\\eta_{\\text{Carnot}} = 1 - \\frac{T_C}{T_H}$ (using absolute temperatures in Kelvin).
No real heat engine can exceed this thermal efficiency.`
  },
  {
    id: "chem-01",
    title: "Quantum Mechanics & Atomic Orbitals",
    subject: "Chemistry",
    preview: "Understanding electron configurations, quantum numbers, and building principles like Pauli and Hund.",
    tags: ["Physical Chemistry", "Atomic Structure", "Quantum"],
    content: `Electrons do not reside in neat orbits like planets. Instead, we define three-dimensional probability density structures called atomic orbitals:
The four quantum numbers precisely define the state of an electron:
1. Principal ($n = 1, 2, \\dots$): Dictates energy level and average distance from nucleus.
2. Angular momentum ($l = 0$ to $n-1$): Specifies orbital shape ($0 = s, 1 = p, 2 = d, 3 = f$).
3. Magnetic ($m_l = -l$ to $+l$): Specifies spatial orientation of that orbital.
4. Spin ($m_s = +1/2$ or $-1/2$): The intrinsic spin state of the electron.

Three governing principles dictating electron filling:
- Aufbau Principle: Fill lower energy levels first.
- Pauli Exclusion Principle: No two electrons in an atom can have the exact same four quantum numbers (implies maximum 2 electrons per orbital with opposite spins).
- Hund's Rule: Degenerate orbitals are singly occupied with parallel spins before they pair up.`
  },
  {
    id: "chem-02",
    title: "Nucleophilic Substitutions (SN1 vs SN2)",
    subject: "Chemistry",
    preview: "Comparing organic chemistry pathways, solvent effects, substrate structures, and stereochem results.",
    tags: ["Organic Chemistry", "Reactions", "Mechanisms"],
    content: `Nucleophilic aliphatic substitution is partitioned into two major mechanistic archetypes:

1. $S_N1$ (Substitution Nucleophilic Unimolecular):
- **Rate law**: Rate = $k[R-X]$ (Only depends on substrate concentration).
- **Mechanism**: Dynamic step-wise process. First, the leaving group departs to form a carbocation intermediate (rate-determining step), followed by rapid nucleophilic attack.
- **Substrate preference**: $3^\\circ > 2^\\circ \\gg 1^\\circ$ (Tertiary substrates form extremely stable carbocations).
- **Stereochemistry**: Produces racemization (both inversion and retention of configuration) because the carbocation intermediate is planar, allowing the nucleophile to attack from either face.
- **Solvent**: Favors polar protic solvents, which stabilize both carbocation intermediates and anionic leaving groups.

2. $S_N2$ (Substitution Nucleophilic Bimolecular):
- **Rate law**: Rate = $k[R-X][\\text{Nu}^-]$ (Depends on both substrate and nucleophile).
- **Mechanism**: Single concerted step of back-side nucleophilic attack contemporaneous with leaving group departure.
- **Substrate preference**: Methyl $> 1^\\circ > 2^\\circ \\gg 3^\\circ$ (Steric hindrance severely blocks the back-side approach).
- **Stereochemistry**: Complete inversion of configuration (Walden inversion).
- **Solvent**: Favors polar aprotic solvents, which do not shield the nucleophile, leaving it highly reactive.`
  },
  {
    id: "cs-01",
    title: "Big-O Notation & Advanced Sorting Algorithms",
    subject: "Computer Science",
    preview: "Asymptotic runtime behaviors, comparing Quick Sort, Merge Sort, and Heap Sort in average and worst cases.",
    tags: ["Algorithms", "Complexity", "Sorting"],
    content: `Asymptotic analysis gauges algorithm performance relative to input size $n$:
- **Big-O ($O$)**: Represents an asymptotic upper bound on runtime.
- **Big-Omega ($\\Omega$)**: Represents an asymptotic lower bound on runtime.
- **Big-Theta ($\\Theta$)**: Represents an asymptotic tight bound on runtime (both upper and lower).

Comparative Sorting Table:
1. **Merge Sort**:
   * Average Complexity: $O(n \\log n)$
   * Worst Case Complexity: $O(n \\log n)$
   * Space Complexity: $O(n)$ (requires auxiliary buffer space)
   * Stability: Stable

2. **Quick Sort**:
   * Average Complexity: $O(n \\log n)$
   * Worst Case Complexity: $O(n^2)$ (occurs with bad pivot choice on highly skewed or sorted arrays)
   * Space Complexity: $O(\\log n)$ (call stack space)
   * Stability: Unstable

3. **Heap Sort**:
   * Average Complexity: $O(n \\log n)$
   * Worst Case Complexity: $O(n \\log n)$
   * Space Complexity: $O(1)$ (entirely in-place)
   * Stability: Unstable`
  }
];

export const STATIC_PYQS: Question[] = [
  {
    id: "pyq-01",
    text: "Evaluate the limit as x approaches 0: lim (x -> 0) [ (sin 3x) / x ].",
    options: ["1/3", "1", "3", "0"],
    correctAnswer: 2,
    subject: "Mathematics",
    exam: "IIT JEE",
    year: 2022,
    explanation: "By rewriting the limit expression as 3 * [ (sin 3x) / (3x) ], and substituting u = 3x, we get lim (u -> 0) 3 * [ (sin u) / u ]. Since the standard trigonometric limit informs us that lim (u -> 0) (sin u)/u = 1, the result is 3 * 1 = 3."
  },
  {
    id: "pyq-02",
    text: "What are the eigenvalues of the standard identity-like matrix A = [[2, 0], [1, 3]]?",
    options: ["2 and 3", "0 and 2", "1 and 3", "2 and -3"],
    correctAnswer: 0,
    subject: "Mathematics",
    exam: "GRE Math",
    year: 2021,
    explanation: "For a lower or upper triangular matrix (like state A here where the upper right is 0, making it triangular if transposed, or simply looking at the diagonal equation: det(A-λI) = (2-λ)(3-λ) = 0), the eigenvalues are precisely the elements on its main diagonal. Thus, the eigenvalues are 2 and 3."
  },
  {
    id: "pyq-03",
    text: "A 5.0 kg block is pulled along a rough horizontal plane at a constant velocity by a force of 15 N. What is the coefficient of kinetic friction (μ_k) if g is taken as 10 m/s^2?",
    options: ["0.15", "0.30", "0.45", "0.50"],
    correctAnswer: 1,
    subject: "Physics",
    exam: "SAT Physics",
    year: 2023,
    explanation: "Because the block is moving at a constant velocity, it has zero acceleration, meaning F_net = 0. Therefore, the pulling force F must equal the friction force f_k.\nf_k = μ_k * F_n = μ_k * m * g\n15 N = μ_k * (5.0 kg * 10 m/s^2) = μ_k * 50 N\nμ_k = 15 / 50 = 0.30."
  },
  {
    id: "pyq-04",
    text: "What is the maximum theoretical efficiency of a Carnot heat engine operating between a steam temperature reservoir at 100°C (373 K) and a surrounding ambient reservoir at 25°C (298 K)?",
    options: ["20.1%", "25.0%", "75.0%", "100.0%"],
    correctAnswer: 0,
    subject: "Physics",
    exam: "AP Physics",
    year: 2022,
    explanation: "The Carnot efficiency depends strictly on the temperatures of the hot and cold reservoirs in Kelvin:\nEfficiency (η) = 1 - (T_C / T_H) = 1 - (298 / 373) = 1 - 0.7989 = 0.2011, which corresponds to 20.1%."
  },
  {
    id: "pyq-05",
    text: "Which of the following organic reaction pathways benefits directly from polar protic solvents, promoting carbocation stabilization?",
    options: ["SN2", "SN1", "E2 concerted substitution", "Grignard reagent synthesis"],
    correctAnswer: 1,
    subject: "Chemistry",
    exam: "NEET Organic",
    year: 2022,
    explanation: "SN1 reactions involve the dynamic dissociation of a leaving group to yield a carbocation intermediate. Polar protic solvents stabilize the cation through oxygen lone pairs and the anion through hydrogen bonding, accelerating the rate-determining step."
  },
  {
    id: "pyq-06",
    text: "Which sorting algorithm possesses a stable average time complexity of O(n log n) and a worst case space complexity of O(n)?",
    options: ["Quick Sort", "Heap Sort", "Merge Sort", "Bubble Sort"],
    correctAnswer: 2,
    subject: "Computer Science",
    exam: "AP Computer Science",
    year: 2023,
    explanation: "Merge Sort splits arrays into halves recursively, sorting and merging. It guarantees O(n log n) time in all states (best, average, worst) and is highly stable, but requires O(n) auxiliary buffer array space."
  }
];

export const MOCK_TESTS: MockTest[] = [
  {
    id: "mock-01",
    title: "Engineering Mechanics & Dynamics Diagnostics",
    subject: "Physics",
    durationMinutes: 10,
    questions: [
      {
        id: "m1-q1",
        text: "An object is thrown vertically upwards with an initial velocity of 20 m/s from a height of 10m. Taking g = 10 m/s^2, what is the maximum height reached by the object relative to the ground?",
        options: ["20 m", "30 m", "40 m", "50 m"],
        correctAnswer: 1,
        subject: "Physics",
        exam: "Mock Practice"
      },
      {
        id: "m1-q2",
        text: "A 2kg weight is hanging from two symmetric ropes acting at a 60 degree angle to each other. What is the tension in each rope? (g = 10 m/s^2, sin(30) = 0.5, cos(30) = 0.866)",
        options: ["10 N", "11.5 N", "20 N", "23.1 N"],
        correctAnswer: 1,
        subject: "Physics",
        exam: "Mock Practice"
      },
      {
        id: "m1-q3",
        text: "When a rolling wheel undergoes pure rolling (without slipping) on flat ground, what is the instantaneous velocity of the tyre relative to the ground at the direct point of contact?",
        options: ["Equal to linear velocity v", "Equal to 2v", "Zero", "Depends on friction coefficient"],
        correctAnswer: 2,
        subject: "Physics",
        exam: "Mock Practice"
      },
      {
        id: "m1-q4",
        text: "The mechanical force of gravity obeys the inverse square law. If the radius of the Earth was instantly halved while maintaining the same mass, the local surface gravity acceleration g would:",
        options: ["Double", "Quadruple", "Be Halved", "Become 1/4th"],
        correctAnswer: 1,
        subject: "Physics",
        exam: "Mock Practice"
      },
      {
        id: "m1-q5",
        text: "A bullet of mass 10g is shot into a hanging sand block of 990g and embeds itself. What physical parameter is strictly conserved during this impact?",
        options: ["Kinetic Energy only", "Linear Momentum only", "Both Kinetic Energy and Linear Momentum", "Mechanical Energy"],
        correctAnswer: 1,
        subject: "Physics",
        exam: "Mock Practice"
      }
    ]
  },
  {
    id: "mock-02",
    title: "Essential Limits, Calculus & Algebra",
    subject: "Mathematics",
    durationMinutes: 10,
    questions: [
      {
        id: "m2-q1",
        text: "What is the derivative of the natural log function: d/dx [ ln(x^2 + 3) ]?",
        options: ["1 / (x^2 + 3)", "2x / (x^2 + 3)", "2 / (x^2 + 3)", "2x / x"],
        correctAnswer: 1,
        subject: "Mathematics",
        exam: "Mock Practice"
      },
      {
        id: "m2-q2",
        text: "Find the value of the dynamic integral: Integral from 0 to 2 of [ 3x^2 ] dx.",
        options: ["4", "6", "8", "12"],
        correctAnswer: 2,
        subject: "Mathematics",
        exam: "Mock Practice"
      },
      {
        id: "m2-q3",
        text: "If a 3x3 square matrix A has a determinant value of 5, what is the determinant value of the matrix defined by (2 * A)?",
        options: ["10", "15", "30", "40"],
        correctAnswer: 3,
        subject: "Mathematics",
        exam: "Mock Practice"
      },
      {
        id: "m2-q4",
        text: "A line is tangent to the curve y = f(x) = x^2 - x at x = 2. What is the slope of this tangent line?",
        options: ["1", "2", "3", "4"],
        correctAnswer: 2,
        subject: "Mathematics",
        exam: "Mock Practice"
      },
      {
        id: "m2-q5",
        text: "Which condition guarantees that a set of vectors v1, v2, ..., vk spans a k-dimensional vector space?",
        options: ["They are linearly independent", "They are all mutually orthogonal", "The zero vector is excluded", "None of the above"],
        correctAnswer: 0,
        subject: "Mathematics",
        exam: "Mock Practice"
      }
    ]
  },
  {
    id: "mock-03",
    title: "Fundamentals of Computer Science & Databases",
    subject: "Computer Science",
    durationMinutes: 10,
    questions: [
      {
        id: "m3-q1",
        text: "Which data structure operates on a First-In, First-Out (FIFO) access policy to retrieve active element states?",
        options: ["Stack", "Queue", "Priority Heap", "Singly Linked List"],
        correctAnswer: 1,
        subject: "Computer Science",
        exam: "Mock Practice"
      },
      {
        id: "m3-q2",
        text: "What is the average time complexity of searching for a value in a balanced Binary Search Tree (such as an AVL tree) containing n elements?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 1,
        subject: "Computer Science",
        exam: "Mock Practice"
      },
      {
        id: "m3-q3",
        text: "In database design, which Normal Form guarantees that there are no partial key dependencies on composite primary keys?",
        options: ["1NF", "2NF", "3NF", "Boyce-Codd NF"],
        correctAnswer: 1,
        subject: "Computer Science",
        exam: "Mock Practice"
      },
      {
        id: "m3-q4",
        text: "What protocol is widely used to synchronize distributed systems and ensure atomicity in databases across multi-server layouts?",
        options: ["Two-Phase Commit (2PC)", "Symmetric Cryptography", "Secure Sockets Layer (SSL)", "Transmission Control Protocol"],
        correctAnswer: 0,
        subject: "Computer Science",
        exam: "Mock Practice"
      },
      {
        id: "m3-q5",
        text: "Which algorithm traversal strategy uses a Queue class structure to access grid graph elements broadly?",
        options: ["Depth First Search (DFS)", "Dijkstra shortest path", "Breadth First Search (BFS)", "Kruskal algorithm MST"],
        correctAnswer: 2,
        subject: "Computer Science",
        exam: "Mock Practice"
      }
    ]
  }
];
