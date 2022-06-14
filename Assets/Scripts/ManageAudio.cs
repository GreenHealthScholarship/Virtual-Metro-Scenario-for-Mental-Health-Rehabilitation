using UnityEngine.Audio;
using System;
using UnityEngine;
using Oculus.Spatializer;

public class ManageAudio : MonoBehaviour
{

    public Sound[] sounds;

    [HideInInspector]
    public ONSPAudioSource spatial;

    public static ManageAudio instance;

    void Awake()
    {

        if (instance == null)
            instance = this;
        else
        {
            Destroy(gameObject);
            return;
        }

        DontDestroyOnLoad(gameObject);

        foreach (Sound s in sounds)
        {
            s.source = gameObject.AddComponent<AudioSource>();
            spatial = gameObject.AddComponent<ONSPAudioSource>();

            s.source.clip = s.clip;

            s.source.volume = s.volume;
            s.source.pitch = s.pitch;
            s.source.spatialBlend = s.spatialBlend;
            s.source.loop = s.loop;
            s.source.minDistance = s.minDistance;
            s.source.maxDistance = s.maxDistance;

            spatial.Near = s.minDistance;
            spatial.Far = s.maxDistance;
        }
    }

    private void Start()
    {
        Play("Ambience");
    }

    public void Play(string name)
    {
        Sound s = Array.Find(sounds, sound => sound.name == name);
        if (s == null)
            return;
        s.source.Play();
    }
}
