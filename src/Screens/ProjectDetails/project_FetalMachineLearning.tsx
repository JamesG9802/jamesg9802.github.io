import { Strong } from "components/Generic/Strong";
import { Text } from "components/Generic/Text";
import { Link } from "react-router-dom";

import DecisionTree from "assets/images/Fetal.png";
import Naive from "assets/images/FetalNaive.png";
import DecisionScore from "assets/images/FetalScore_Decision.png";
import NaiveScore from "assets/images/FetalScore_Naive.png";

import { TextPD } from ".";

export default function FetalHealthContent() {
    return <>
    <Text type="h1" className="mt-2">Introduction</Text>
    <TextPD>
        I've begun taking more interesting classes starting in my second year at NJIT. One of them was my Data Science class where the final project was a group project to develop some machine learning models to analyze trends in a fetal health dataset.  
    </TextPD>
    <Text type="h1" className="mt-2">Process</Text>
    <TextPD>
        We used Python's popular pandas and NumPy libraries for data analysis. I was tasked with creating a naïve bayes and a decision tree model.
    </TextPD>
    <TextPD>
        The dataset we were given contained ~2000 different data points in three distinct classes: normal, suspect, and pathological. However, there were vastly more babies born with a normal level of health compared to suspect and pathological. To account for this, we oversampled the data to improve the model's accuracy. We were able to generate the following models:
    </TextPD>
    <Strong className="my-3">Decision Tree</Strong>
    <img
        src={DecisionTree}
        className="w-full h-auto"
    />
    <Strong className="my-3">Naïve Bayes</Strong>
    <img
        src={Naive}
        className="w-full h-auto"
    />
    <TextPD>
        To evaluate the model's performance, we built a receiver-operator-curve (ROC) to compare the true positive to the false positive rate. The ROC can then be used to calculate the harmonic mean (F1 score) of true positive to false positives where 0 is a very bad score and 1 is a really good score. The below graphs show the scores for the decision tree and naïve bayes models before and after oversampling. 
    </TextPD>
    <Strong className="my-3">Decision Tree</Strong>
    <img
        src={DecisionScore}
        className="w-full h-auto"
    />
    <Strong className="my-3">Naïve Bayes</Strong>
    <img
        src={NaiveScore}
        className="w-full h-auto"
    />
    <TextPD>
        We can see that oversampling hurt the model's performance for evaluating normal babies, but improved the ability to detect babies with abnormalities. 
    </TextPD>
    <Text type="h1" className="mt-2">Retrospective</Text>
    <TextPD>
        For an introductory course, I think our group performed adequately given the knowledge we had at the time. However it could have been more optimal to use a neural network classifier as this is a pretty standard use case. We should have also done more rigorous data processing by normalizing the data and introducing noise into the training data set to allow the model to generalize better.
    </TextPD>
    <Text type="h1" className="mt-2">References</Text>
    <Text>
      <Link target="_blank" rel="noreferrer" to="https://pandas.pydata.org/">
      Pandas - https://pandas.pydata.org/
      </Link>
    </Text>
    <Text>
      <Link target="_blank" rel="noreferrer" to="https://numpy.org/">
      Numpy - https://numpy.org/
      </Link>
    </Text>
  </>
}