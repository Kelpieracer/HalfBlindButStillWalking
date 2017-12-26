# Large Font Fitness Watch

Clock face for [Fitbit Ionic](https://www.fitbit.com/ionic) - Fitness tracker and smartwatch.

**For those of us who need spectacles for reading.**

* Large fonts, but all essential information

<img src="https://github.com/Kelpieracer/HalfBlindButStillWalking/blob/master/In%20use.jpg" alt="Clock face in use" height="220">

I am 51 years old, and my far sight is perfect, but for reading I need glasses. I am not wearing my glasses in sports or walking, and therefore I am not able to see small details in a wrist watch. All the [other available clock faces](https://www.google.fi/search?q=fitbit+ionic+clock+faces&source=lnms&tbm=isch&sa=X&ved=0ahUKEwjDxsrzwKfYAhVLCpoKHQ6rD7AQ_AUICigB&biw=1706&bih=873) with large font do still have either some essential info in small font, or then missing completely.

However, this clock face is **very easy to read** without glasses, even when jogging.

And has **everything you need**, it even has **heart rate zone control** which is very simple to use!
<img src="https://github.com/Kelpieracer/HalfBlindButStillWalking/blob/master/Elements.png" alt="Clock face elements" height="170">

### Features
**Time**
* Current time with huge font
* Day of week and month, but smaller font

**Activity**
1. Steps
2. Calories
3. Distance
4. Duration
* Change the displayed activity by touching it
* Red color indicates you are not even close to your goal
* When you are approaching your goal, having reached 70%, your achievement is shown in yellow
* When you have reached your goal, color changes to green

**Heart Rate**
* Current heart rate
* Current heart rate zone is indicated by colors:
  * No activity - grey
    * Your heart rate is below 50% of maximum, your heart rate may still be elevated but not enough to be considered exercise.
  * Fat burn - green
    * Your heart rate is 50 to 69% of maximum, is the low-to-medium intensity exercise zone and may be a good place to start for those new to exercise. It’s called the fat burn zone because a higher percentage of calories are burned from fat, but the total calorie burn rate is lower.
  * Cardio - yellow
    * Your heart rate is 70 to 84% of maximum, is the medium-to-high intensity exercise zone. In this zone, you're pushing yourself but not straining. For most people, this is the exercise zone to target.
  * Peak - red
    * Your heart rate is greater than 85% of maximum, is the high-intensity exercise zone. The peak zone is for short intense sessions that improve performance and speed.
* In case you have chosen custom heart rate zones, the colors are:
  * Below custom zone: grey
  * In custom zone: green
  * Above custom zone: red
  * Unfortunately Fitbit Apple Phone app has currently some bugs in custom heart rate zone settings, better use Fitbit web interface. 

**Heart Rate Control**
* Heart rate control alarms you with vibration when your heart rate is out of zone you requested. This way you can ensure optimal workout in the heart rate zone you want.
* This clock face has a quick and easy setting for heart rate control:
  * Tap the heart rate indicator to switch between target heart rate zones. Colored border around the heart rate indicator shows the heart rate zones you have now set as target.
  * If you are using automatic Fitbit heart rate zones, then the border colors are:
    * No border: target zone is not set
    * Green: fat burn target zone
    * Yellow: cardio target zone
    * Red: peak target zone
  * If you are using custom heart rate zones, the border colors are:
    * No border: target zone is not set
    * Blue: custom target zone
  * You can change the target zone anytime: quickly change the setting for warm-up, excercise and cool-down just by tapping the heart rate indicator
* If your heart rate is lower than your target zone, the Ionic watch will vibrate five (5) times quickly.
* If your heart rate is higher than your target zone, the Ionic watch will vibrate three (3) times slowly.
* If your heart rate is very low, i.e. you are not moment at all, then the Ionic watch will not vibrate, as this indicates you are doing something else. 
* If still out of zone, the Ionic watch will vibrate again each 20 seconds, until either your heart rate reaches the target zone, or you decide to switch off the heart rate control.

**Battery level**
* Battery level is indicated as % of full charge. 
  * As Ionic needs to be recharged regularly, clear battery indication is absolutely needed.
* When battery level drops below 50%, color changes to yellow. Red color indicates less than 25% of charge.

<img src="https://github.com/Kelpieracer/HalfBlindButStillWalking/blob/master/BlindButStillWalking-screenshot%20(1).png" alt="" height="120">

_Morning ... no activity yet_

<img src="https://github.com/Kelpieracer/HalfBlindButStillWalking/blob/master/BlindButStillWalking-screenshot.png?raw=true" alt="" height="120">

_When your activity goal has been reached, it is indicated by green color_

<img src="https://github.com/Kelpieracer/HalfBlindButStillWalking/blob/master/HalfBlindButStillWalking-screenshot.png?raw=true" alt="" height="120">

_Fat burn heart rate zone is indicated by yellow border around the heart rate indicator_

<img src="https://github.com/Kelpieracer/HalfBlindButStillWalking/blob/master/HalfBlindButStillWalking-screenshot%20(1).png?raw=true" alt="" height="120">

_Cardio heart rate zone is indicated by yellow border around the heart rate indicator_

<img src="https://github.com/Kelpieracer/HalfBlindButStillWalking/blob/master/HalfBlindButStillWalking-screenshot%20(3).png?raw=true" alt="" height="120">

_Peak heart rate zone is indicated by red border around the heart rate indicator_

<img src="https://github.com/Kelpieracer/HalfBlindButStillWalking/blob/master/HalfBlindButStillWalking-screenshot%20(4).png?raw=true" alt="" height="120">

_Custom heart rate zone is indicated by blue border around the heart rate indicator_

