import React, { useState } from 'react';
import type { BuddyType, OnboardingSurveyData } from '../types';

interface OnboardingProps {
  onComplete: (data: {
    name: string;
    type: BuddyType;
    survey: OnboardingSurveyData;
    medsEnabled: boolean;
    medsDosesPerDay: number;
  }) => void;
}

const buddyOptions: { type: BuddyType; label: string; icon: string }[] = [
  { type: 'dog', label: 'Dog', icon: '🐶' },
  { type: 'cat', label: 'Cat', icon: '🐱' },
  { type: 'eagle', label: 'Eagle', icon: '🦅' },
];

const RangeSlider = ({ label, value, min, max, step, onChange, unit, displayValue, minLabel, maxLabel }: { label: string, value: number, min: number, max: number, step: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, unit: string, displayValue?: string, minLabel?: string, maxLabel?: string }) => (
    <div className="w-full">
        <label className="block text-base sm:text-lg font-semibold text-slate-300 mb-2 text-left">
            {label} <span className="font-normal text-slate-400 text-sm">({displayValue || value} {unit})</span>
        </label>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            aria-label={label}
        />
        {(minLabel || maxLabel) && (
            <div className="flex justify-between text-xs text-slate-500 mt-1 px-1">
                <span>{minLabel}</span>
                <span>{maxLabel}</span>
            </div>
        )}
    </div>
);

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedType, setSelectedType] = useState<BuddyType>('dog');

  // State for health survey questions
  const [moveHours, setMoveHours] = useState(1);
  const [sleepHours, setSleepHours] = useState(8);
  const [sedentaryHours, setSedentaryHours] = useState(8);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [exerciseFrequency, setExerciseFrequency] = useState(3);
  const [fiberGrams, setFiberGrams] = useState(25);
  const [waterIntake, setWaterIntake] = useState(6);
  const [processedFoodConsumption, setProcessedFoodConsumption] = useState(3);
  const [readHours, setReadHours] = useState(0.5);
  const [stressLevel, setStressLevel] = useState(5);
  const [socialConnection, setSocialConnection] = useState(3);
  const [screenTimeHours, setScreenTimeHours] = useState(4);
  // State for new medication step
  const [medsEnabled, setMedsEnabled] = useState(false);
  const [medsDosesPerDay, setMedsDosesPerDay] = useState(1);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete({
        name: name.trim(),
        type: selectedType,
        survey: { moveHours, sleepHours, sedentaryHours, sleepQuality, exerciseFrequency, fiberGrams, waterIntake, processedFoodConsumption, readHours, stressLevel, socialConnection, screenTimeHours },
        medsEnabled,
        medsDosesPerDay,
      });
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const totalSteps = 5; // Updated total steps to include medication

  const getDisplayText = (value: number, labels: string[]) => labels[value - 1] || String(value);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 text-center transition-all duration-500">
        
        <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {step === 1 && "Meet Your Buddy!"}
                {step === 2 && "Your Physical Habits"}
                {step === 3 && "Your Nutritional Habits"}
                {step === 4 && "Your Mental Wellness"}
                {step === 5 && "Medication Tracking"}
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
                {step === 1 && "Let's create your motivational companion."}
                {step <= 4 && "Honest answers help your buddy thrive!"}
                {step === 5 && "Optionally, track your daily medication."}
            </p>
            <div className="w-full bg-slate-700 rounded-full h-2.5 mt-4" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={totalSteps}>
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(step / totalSteps) * 100}%`, transition: 'width 0.3s ease-in-out' }}></div>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <>
              <div>
                <label htmlFor="buddy-name" className="block text-base sm:text-lg font-semibold text-slate-300 mb-2"> Name your buddy </label>
                <input id="buddy-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Sparky" className="w-full px-4 py-3 bg-slate-700 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-slate-400" required />
              </div>
              <div>
                <p className="text-base sm:text-lg font-semibold text-slate-300 mb-3">Choose your buddy type</p>
                <div className="flex justify-center gap-2 sm:gap-4">
                  {buddyOptions.map((option) => ( <button key={option.type} type="button" onClick={() => setSelectedType(option.type)} className={`flex-1 p-3 sm:p-4 border-2 rounded-lg transition-all duration-200 ${ selectedType === option.type ? 'bg-blue-500 border-blue-500 text-white shadow-lg scale-105' : 'bg-slate-700 border-slate-600 text-white hover:border-blue-400' }`} aria-pressed={selectedType === option.type}> <span className="text-3xl sm:text-4xl" aria-hidden="true">{option.icon}</span> <span className="block mt-1 font-semibold text-sm sm:text-base">{option.label}</span> </button> ))}
                </div>
              </div>
            </>
          )}

          {step === 2 && ( <div className="space-y-6 flex flex-col items-center"> <RangeSlider label="How many hours do you move or exercise per day?" value={moveHours} min={0} max={5} step={0.5} onChange={(e) => setMoveHours(parseFloat(e.target.value))} unit="hrs" /> <RangeSlider label="How many days a week do you exercise?" value={exerciseFrequency} min={0} max={7} step={1} onChange={(e) => setExerciseFrequency(parseInt(e.target.value))} unit="days" /> <RangeSlider label="How many hours do you sleep per night?" value={sleepHours} min={0} max={12} step={0.5} onChange={(e) => setSleepHours(parseFloat(e.target.value))} unit="hrs" /> <RangeSlider label="How would you rate your sleep quality?" value={sleepQuality} min={1} max={5} step={1} onChange={(e) => setSleepQuality(parseInt(e.target.value))} unit="" displayValue={getDisplayText(sleepQuality, ['Restless', 'Poor', 'Okay', 'Good', 'Excellent'])} minLabel="Restless" maxLabel="Excellent" /> <RangeSlider label="How many hours are you sedentary (sitting) per day?" value={sedentaryHours} min={0} max={24} step={0.5} onChange={(e) => setSedentaryHours(parseFloat(e.target.value))} unit="hrs" /> </div> )}
          {step === 3 && ( <div className="space-y-6 flex flex-col items-center"> <RangeSlider label="How many glasses of water do you drink daily?" value={waterIntake} min={0} max={12} step={1} onChange={(e) => setWaterIntake(parseInt(e.target.value))} unit="glasses" displayValue={waterIntake === 12 ? '12+' : String(waterIntake)} /> <RangeSlider label="How many grams of fiber do you eat per day?" value={fiberGrams} min={0} max={50} step={5} onChange={(e) => setFiberGrams(parseInt(e.target.value))} unit="g" /> <RangeSlider label="How often do you eat processed or fast food?" value={processedFoodConsumption} min={1} max={5} step={1} onChange={(e) => setProcessedFoodConsumption(parseInt(e.target.value))} unit="" displayValue={getDisplayText(processedFoodConsumption, ['Very Rarely', 'Rarely', 'Sometimes', 'Often', 'Very Often'])} minLabel="Rarely" maxLabel="Often" /> </div> )}
          {step === 4 && ( <div className="space-y-6 flex flex-col items-center"> <RangeSlider label="How many hours do you read/study per day?" value={readHours} min={0} max={8} step={0.5} onChange={(e) => setReadHours(parseFloat(e.target.value))} unit="hrs" /> <RangeSlider label="On a scale of 1-10, what is your typical stress level?" value={stressLevel} min={1} max={10} step={1} onChange={(e) => setStressLevel(parseInt(e.target.value))} unit="" displayValue={`${stressLevel}/10`} minLabel="Low" maxLabel="High" /> <RangeSlider label="How often do you connect with friends or family?" value={socialConnection} min={1} max={5} step={1} onChange={(e) => setSocialConnection(parseInt(e.target.value))} unit="" displayValue={getDisplayText(socialConnection, ['Rarely', 'Weekly', 'A Few Times a Week', 'Daily', 'Multiple Times a Day'])} minLabel="Rarely" maxLabel="Daily" /> <RangeSlider label="How many hours of non-work screen time do you have daily?" value={screenTimeHours} min={0} max={10} step={0.5} onChange={(e) => setScreenTimeHours(parseFloat(e.target.value))} unit="hrs" displayValue={screenTimeHours === 10 ? '10+' : String(screenTimeHours)} /> </div> )}
          
          {step === 5 && (
            <div className="space-y-6 flex flex-col items-center text-left">
                <label htmlFor="meds-enabled-toggle" className="flex items-center cursor-pointer w-full p-4 bg-slate-700 rounded-lg">
                  <div className="relative">
                    <input type="checkbox" id="meds-enabled-toggle" className="sr-only" checked={medsEnabled} onChange={() => setMedsEnabled(!medsEnabled)} />
                    <div className="block bg-slate-600 w-14 h-8 rounded-full"></div>
                    <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                  </div>
                  <div className="ml-4 flex-grow">
                    <p className="font-semibold text-slate-200">Track Daily Medication?</p>
                    <p className="text-xs text-slate-400">Enable this to add a medication tracker to your dashboard.</p>
                  </div>
                </label>
                {medsEnabled && (
                    <div className="w-full pt-4">
                        <RangeSlider label="How many doses per day?" value={medsDosesPerDay} min={1} max={10} step={1} onChange={(e) => setMedsDosesPerDay(parseInt(e.target.value))} unit={medsDosesPerDay > 1 ? 'doses' : 'dose'} />
                    </div>
                )}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            {step > 1 && ( <button type="button" onClick={prevStep} className="w-full bg-slate-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-700 transition-transform transform hover:scale-105"> Back </button> )}
            {step < totalSteps ? ( <button type="button" onClick={nextStep} disabled={step === 1 && !name.trim()} className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 disabled:bg-slate-600 disabled:text-slate-400 transition-transform transform hover:scale-105"> Next </button> ) : ( <button type="submit" className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105"> Let's Get Started! </button> )}
          </div>
        </form>
        <style>{`#meds-enabled-toggle:checked ~ .dot { transform: translateX(100%); background-color: #34d399; }`}</style>
      </div>
    </div>
  );
};

export default Onboarding;