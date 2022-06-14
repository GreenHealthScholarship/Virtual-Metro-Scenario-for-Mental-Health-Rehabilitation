using UnityEngine.Audio;
using UnityEngine;
using Oculus.Spatializer;

public class PlaySoundOnStateEnter : StateMachineBehaviour
{

    public Sound sound;

    [HideInInspector]
    public ONSPAudioSource spatial;

    override public void OnStateEnter(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    {

        sound.source = animator.gameObject.AddComponent<AudioSource>();
        spatial = animator.gameObject.AddComponent<ONSPAudioSource>();

        sound.source.clip = sound.clip;

        sound.source.volume = sound.volume;
        sound.source.pitch = sound.pitch;
        sound.source.spatialBlend = sound.spatialBlend;
        sound.source.loop = sound.loop;
        sound.source.minDistance = sound.minDistance;
        sound.source.maxDistance = sound.maxDistance;

        spatial.Gain = 15f;
        spatial.Near = sound.minDistance;
        spatial.Far = sound.maxDistance;

        sound.source.Play();

    }

    public override void OnStateExit(Animator animator, AnimatorStateInfo stateInfo, int layerIndex)
    {

        sound.source.Stop();
        Destroy(spatial);
        Destroy(sound.source);

    }

}
