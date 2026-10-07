import { ExerciseItem } from '../types/fitness';

export const exerciseLibrary: ExerciseItem[] = [
  // CHEST
  {
    id: 'ex-barbell-bench-press',
    name: 'Barbell Bench Press',
    category: 'Chest',
    targetMuscle: 'Pectoralis Major, Triceps, Anterior Deltoids',
    equipment: 'Barbell & Flat Bench',
    difficulty: 'Intermediate',
    instructions: [
      'Lie flat on the bench with feet firmly planted on the floor.',
      'Grasp the barbell with an overhand grip slightly wider than shoulder-width.',
      'Unrack the bar and bring it directly above your chest with arms locked.',
      'Inhale and lower the bar under control until it lightly touches your mid-chest.',
      'Drive the barbell back up explosively through your palms to the starting position.'
    ]
  },
  {
    id: 'ex-incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    category: 'Chest',
    targetMuscle: 'Upper Pectoralis Major, Clavicular Head',
    equipment: 'Dumbbells & Incline Bench (30°)',
    difficulty: 'Intermediate',
    instructions: [
      'Adjust an incline bench to approximately 30 degrees.',
      'Sit with dumbbells resting on your thighs, then kick them up to shoulder height as you lie back.',
      'Press the dumbbells straight up above your upper chest until arms are fully extended.',
      'Lower the weights slowly until you feel a deep stretch in your upper chest.',
      'Press back up while squeezing your chest at the top.'
    ]
  },
  {
    id: 'ex-cable-crossover',
    name: 'Standing Cable Fly / Crossover',
    category: 'Chest',
    targetMuscle: 'Sternal & Lower Pectoralis',
    equipment: 'Dual Cable Machine',
    difficulty: 'Beginner',
    instructions: [
      'Set high pulleys on both sides of a cable station.',
      'Grasp handles and step forward with one foot for stability, arms spread wide with a slight elbow bend.',
      'Bring handles together in a sweeping downward arc until hands meet in front of waist.',
      'Squeeze chest muscles hard for a second, then return with control to stretch position.'
    ]
  },
  {
    id: 'ex-pushups',
    name: 'Standard Push-ups',
    category: 'Chest',
    targetMuscle: 'Chest, Triceps, Core Stabilizers',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Assume a high plank position with hands shoulder-width apart and fingers pointed forward.',
      'Engage glutes and core to keep your spine straight from head to heels.',
      'Lower your body until your chest is an inch above the floor, elbows angled at 45 degrees.',
      'Push firmly through the floor to return to starting position.'
    ]
  },
  {
    id: 'ex-chest-dips',
    name: 'Chest Dips',
    category: 'Chest',
    targetMuscle: 'Lower Pectoralis, Triceps',
    equipment: 'Dip Parallel Station',
    difficulty: 'Intermediate',
    instructions: [
      'Grasp parallel dip bars and push yourself up to straight arms.',
      'Lean your torso forward at a 30-degree angle to place emphasis on chest.',
      'Bend elbows to lower your body until upper arms are parallel to the ground.',
      'Push through your hands to return to the starting locked position.'
    ]
  },

  // BACK
  {
    id: 'ex-deadlift',
    name: 'Conventional Barbell Deadlift',
    category: 'Back',
    targetMuscle: 'Erector Spinae, Latissimus Dorsi, Glutes, Hamstrings',
    equipment: 'Barbell',
    difficulty: 'Advanced',
    instructions: [
      'Stand with feet hip-width apart, barbell over mid-foot.',
      'Hinge at hips to grip the bar with hands just outside your legs.',
      'Lower hips, pull shoulders back, brace core, and flatten lower back.',
      'Drive through mid-foot to lift bar, keeping it close to shins until standing tall.',
      'Lower bar with control by hinging back at hips.'
    ]
  },
  {
    id: 'ex-barbell-row',
    name: 'Bent-Over Barbell Row',
    category: 'Back',
    targetMuscle: 'Rhomboids, Middle Trapezius, Latissimus Dorsi',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    instructions: [
      'Stand holding barbell with shoulder-width overhand grip.',
      'Hinge forward at hips until torso is nearly parallel to floor with knees soft.',
      'Pull barbell toward lower ribs, drawing shoulder blades together at peak contraction.',
      'Lower weight under control back to extended arm hanging position.'
    ]
  },
  {
    id: 'ex-lat-pulldown',
    name: 'Wide-Grip Lat Pulldown',
    category: 'Back',
    targetMuscle: 'Latissimus Dorsi, Teres Major',
    equipment: 'Cable Cable Station',
    difficulty: 'Beginner',
    instructions: [
      'Sit facing pulldown machine and adjust thigh pad snugly.',
      'Grasp wide bar with overhand grip wider than shoulder-width.',
      'Pull bar down to upper chest while arching upper back slightly.',
      'Hold contraction for a second, then return bar under control overhead.'
    ]
  },
  {
    id: 'ex-pullups',
    name: 'Strict Overhand Pull-Ups',
    category: 'Back',
    targetMuscle: 'Lats, Upper Back, Biceps',
    equipment: 'Pull-up Bar',
    difficulty: 'Intermediate',
    instructions: [
      'Grasp pull-up bar with overhand grip slightly wider than shoulders.',
      'Hang with full arm extension and cross ankles behind you.',
      'Pull elbows down toward hips until chin clears bar.',
      'Lower down smoothly to full arm extension.'
    ]
  },
  {
    id: 'ex-seated-cable-row',
    name: 'Seated Cable Row',
    category: 'Back',
    targetMuscle: 'Rhomboids, Lats, Posteriors',
    equipment: 'Seated Cable Station',
    difficulty: 'Beginner',
    instructions: [
      'Sit with feet on footrests and knees slightly bent.',
      'Reach forward and grip V-bar attachment with arms extended.',
      'Pull handle toward stomach while keeping back straight and chest proud.',
      'Squeeze shoulder blades together, then return slowly.'
    ]
  },

  // SHOULDERS
  {
    id: 'ex-overhead-barbell-press',
    name: 'Standing Barbell Military Press',
    category: 'Shoulders',
    targetMuscle: 'Anterior & Lateral Deltoids, Triceps',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    instructions: [
      'Stand feet shoulder-width apart, holding barbell on upper chest.',
      'Brace core and glutes, press bar straight up overhead.',
      'Lock out arms with bar directly over ears.',
      'Lower bar smoothly back to upper collarbone.'
    ]
  },
  {
    id: 'ex-arnold-press',
    name: 'Arnold Dumbbell Press',
    category: 'Shoulders',
    targetMuscle: 'All 3 Deltoid Heads',
    equipment: 'Dumbbells',
    difficulty: 'Intermediate',
    instructions: [
      'Sit on bench holding dumbbells at chest level, palms facing you.',
      'As you press weights overhead, rotate wrists so palms face forward at top.',
      'Reverse rotation as you lower weights back to chest level.'
    ]
  },
  {
    id: 'ex-lateral-raise',
    name: 'Dumbbell Lateral Raise',
    category: 'Shoulders',
    targetMuscle: 'Lateral Deltoids (Side Shoulders)',
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Stand upright holding dumbbells at sides.',
      'Raise arms out to sides with slight elbow bend until parallel with floor.',
      'Lower weights slowly, resisting gravity on the way down.'
    ]
  },
  {
    id: 'ex-face-pulls',
    name: 'Cable Face Pulls',
    category: 'Shoulders',
    targetMuscle: 'Posterior Deltoids, Rotator Cuff, Upper Traps',
    equipment: 'Cable Pulley & Rope Attachment',
    difficulty: 'Beginner',
    instructions: [
      'Set cable pulley to upper chest height with rope attachment.',
      'Grasp rope ends with thumbs pointing backward.',
      'Step back, pull rope toward nose while flaring elbows outward.',
      'Rotate wrists backward at end of movement to strengthen rear delts.'
    ]
  },

  // ARMS
  {
    id: 'ex-barbell-curl',
    name: 'Standing Barbell Bicep Curl',
    category: 'Arms',
    targetMuscle: 'Biceps Brachii',
    equipment: 'Barbell / EZ Bar',
    difficulty: 'Beginner',
    instructions: [
      'Stand holding barbell with underhand shoulder-width grip.',
      'Keep elbows close to torso and curl weight up toward shoulders.',
      'Squeeze biceps at peak contraction, then lower with control.'
    ]
  },
  {
    id: 'ex-hammer-curl',
    name: 'Dumbbell Hammer Curls',
    category: 'Arms',
    targetMuscle: 'Brachialis, Brachioradialis, Biceps',
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Stand holding dumbbells at sides with neutral grip (palms facing each other).',
      'Curl dumbbells up while keeping palms facing inward.',
      'Lower weights down with steady control.'
    ]
  },
  {
    id: 'ex-tricep-pushdown',
    name: 'Cable Triceps Rope Pushdown',
    category: 'Arms',
    targetMuscle: 'Triceps Lateral & Lateral Heads',
    equipment: 'Cable High Pulley & Rope',
    difficulty: 'Beginner',
    instructions: [
      'Attach rope to high pulley, grip rope near knots with elbows pinned at sides.',
      'Extend arms downward, spreading rope ends apart at bottom.',
      'Return to 90-degree elbow bend slowly.'
    ]
  },
  {
    id: 'ex-skullcrushers',
    name: 'Lying Lying Triceps Extension (Skullcrushers)',
    category: 'Arms',
    targetMuscle: 'Triceps Long Head',
    equipment: 'EZ Bar & Flat Bench',
    difficulty: 'Intermediate',
    instructions: [
      'Lie on bench holding EZ bar overhead with arms extended.',
      'Bend elbows to lower bar toward forehead, keeping upper arms still.',
      'Extend arms back up to starting position.'
    ]
  },

  // LEGS
  {
    id: 'ex-barbell-back-squat',
    name: 'Barbell Back Squat',
    category: 'Legs',
    targetMuscle: 'Quadriceps, Gluteus Maximus, Hamstrings',
    equipment: 'Barbell & Squat Rack',
    difficulty: 'Intermediate',
    instructions: [
      'Rest bar across upper trapezius and grip tightly.',
      'Stand feet shoulder-width apart with toes angled slightly out.',
      'Squat down by bending knees and sitting back into hips until thighs are parallel to floor.',
      'Drive up through mid-foot to return standing tall.'
    ]
  },
  {
    id: 'ex-leg-press',
    name: '45-Degree Leg Press',
    category: 'Legs',
    targetMuscle: 'Quadriceps, Glutes',
    equipment: 'Leg Press Machine',
    difficulty: 'Beginner',
    instructions: [
      'Sit in machine with back flat against backrest and feet shoulder-width on platform.',
      'Release safety handles and lower platform until knees reach 90 degrees.',
      'Push platform back up without locking knees.'
    ]
  },
  {
    id: 'ex-romanian-deadlift',
    name: 'Romanian Deadlift (RDL)',
    category: 'Legs',
    targetMuscle: 'Hamstrings, Glutes, Lower Back',
    equipment: 'Barbell or Dumbbells',
    difficulty: 'Intermediate',
    instructions: [
      'Stand holding barbell at upper thighs with knees soft.',
      'Hinge at hips, pushing glutes backward while keeping back flat.',
      'Lower bar along shins until hamstrings are fully stretched.',
      'Contract glutes to pull back to standing position.'
    ]
  },
  {
    id: 'ex-walking-lunges',
    name: 'Dumbbell Walking Lunges',
    category: 'Legs',
    targetMuscle: 'Quadriceps, Glutes, Calves',
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Stand holding dumbbells at sides.',
      'Step forward with right leg and lower back knee toward floor.',
      'Push off right foot to step into next lunge with left foot.'
    ]
  },

  // CORE
  {
    id: 'ex-plank',
    name: 'Isometric Forearm Plank',
    category: 'Core',
    targetMuscle: 'Transverse Abdominis, Rectus Abdominis',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Place forearms on mat with elbows under shoulders.',
      'Extend legs back on toes, keeping body in straight line.',
      'Hold position by bracing abs tightly without letting hips dip.'
    ]
  },
  {
    id: 'ex-hanging-leg-raise',
    name: 'Hanging Leg Raises',
    category: 'Core',
    targetMuscle: 'Lower Abs, Hip Flexors',
    equipment: 'Pull-up Bar',
    difficulty: 'Advanced',
    instructions: [
      'Hang from pull-up bar with arms straight.',
      'Raise legs together smoothly until parallel to floor or higher.',
      'Lower down without swinging momentum.'
    ]
  },
  {
    id: 'ex-ab-rollout',
    name: 'Ab Wheel Rollout',
    category: 'Core',
    targetMuscle: 'Full Core, Lats',
    equipment: 'Ab Roller Wheel',
    difficulty: 'Advanced',
    instructions: [
      'Kneel on mat holding wheel handles on floor under shoulders.',
      'Roll wheel forward extending arms and hips until body is straight.',
      'Pull wheel back using abs to starting kneeling position.'
    ]
  },

  // FULL BODY & CARDIO
  {
    id: 'ex-kettlebell-swing',
    name: 'Kettlebell Swings',
    category: 'Full Body',
    targetMuscle: 'Glutes, Hamstrings, Core, Shoulders',
    equipment: 'Kettlebell',
    difficulty: 'Intermediate',
    instructions: [
      'Stand feet shoulder-width, hold kettlebell with both hands in front.',
      'Hinge at hips swinging bell between legs.',
      'Drive hips forward explosively to swing bell to chest height.'
    ]
  },
  {
    id: 'ex-burpees',
    name: 'Explosive Burpees',
    category: 'Full Body',
    targetMuscle: 'Cardiovascular, Full Body Conditioning',
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    instructions: [
      'From standing, drop into squat, place hands on floor.',
      'Jump feet back into plank, perform push-up.',
      'Jump feet back to hands and jump explosively into air.'
    ]
  },
  {
    id: 'ex-treadmill-running',
    name: 'Treadmill / Outdoor Running',
    category: 'Cardio',
    targetMuscle: 'Heart, Legs, Enduring Stamina',
    equipment: 'Treadmill or Open Track',
    difficulty: 'Beginner',
    instructions: [
      'Maintain steady running gait landing on midfoot.',
      'Keep posture upright with arms swinging loosely at waist.'
    ]
  },
  {
    id: 'ex-rowing-machine',
    name: 'Rowing Ergometer Machine',
    category: 'Cardio',
    targetMuscle: 'Legs, Back, Arms, Cardiovascular System',
    equipment: 'Rowing Machine',
    difficulty: 'Beginner',
    instructions: [
      'Push off footrest with legs, then lean back slightly and pull handle to lower ribs.',
      'Extend arms forward, hinge at hips, and bend knees to return to catch position.'
    ]
  }
];
