import { Text } from "components/Generic/Text";
import { Link } from "react-router-dom";

import Google_Transformation from "assets/images/Google_Transformation.png";
import { TextPD } from ".";

export default function GoogleQuickDrawContent() {
    return <>
    <Text type="h1" className="mt-2">Introduction</Text>
    <TextPD>
        For my machine learning class, I decided to train a neural network classifier on Google’s QuickDraw dataset. The QuickDraw dataset is a collection of images gathered from people drawing an image in 20 seconds or less.
    </TextPD>
    <Text type="h1" className="mt-2">Process</Text>
    <TextPD>
        We used the PyTorch library to create our model. As this is an image classification task, it was decided that a convolutional neural network was the most suited for this task. The initial version of the model achieved an impressive 95% accuracy on the training set but a dismal 45% accuracy on the testing set.
    </TextPD>
    <TextPD>
        This could be attributed to the fact that the dataset had a diverse range of drawings and the training set was not representative enough. We fixed this by applying random noise to the images to force the model to generalize more and stop overfitting. This resulted in a worse 82% accuracy on the training set but a coincidentally equivalent 82% accuracy on the testing set as well. 
    </TextPD>
    <img
        src={Google_Transformation}
        className="w-full h-auto"
    />
    <Text type="h1" className="mt-2">Retrospective</Text>
    <TextPD>
        This project went almost perfectly well. It was surprising how much the performance of the model improved after implementing random noise to break up the patterns. Perhaps the only thing that could be improved was if we implemented more techniques to improve the accuracy, such as by fine tuning the hyperparameters and adding more convolutional models. 
    </TextPD>
    <Text type="h1" className="mt-2">References</Text>
    <Text>
      <Link target="_blank" rel="noreferrer" to="https://quickdraw.withgoogle.com/data">
        Google Quick Draw - https://quickdraw.withgoogle.com/data
      </Link>
    </Text>
    <Text>
      <Link target="_blank" rel="noreferrer" to="https://github.com/Toash/Convolutional-Neural-Network">
        Source Code - https://github.com/Toash/Convolutional-Neural-Network
      </Link>
    </Text>
  </>
}