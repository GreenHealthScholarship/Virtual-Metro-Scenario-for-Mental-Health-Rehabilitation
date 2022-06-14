using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Bhaptics.Tact.Unity
{
    public class bHapticsManager : MonoBehaviour{
        public VestHapticClip[] BodyClips;
        
        private void OnCollisionEnter(Collision other) {
            Debug.Log("Log");
            if(other.gameObject.tag == "NPC"){
                HapticClip clip = BodyClips[0];
                Debug.Log("Play");
                clip.Play(1f, 1f, 0f, 0f);
            }
        }
    }
}